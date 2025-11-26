import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { ICartRepository } from "../interface";
import { Cart, cartSchema, IUpdateCartForm } from "../model";
import { CartItem, Status } from "../../cartitem/model";
import appConfig from "../../../shared/common/config";
import { getDimensionForProduct } from "../../../shared/common/type";
import {
  createVnpayChecksum,
  formatDate,
  sortObject,
} from "../../../shared/utils/dateformat";
import qs from "qs";
import crypto from "crypto";

export class MongodbCartRepository implements ICartRepository {
  async insert(cart: Cart): Promise<Cart> {
    const result = await mongodbService.cart.insertOne(cart);

    const found = await mongodbService.cart.findOne({ _id: result.insertedId });

    return found as Cart;
  }
  async findById(id: string): Promise<Cart | null> {
    const cart = await mongodbService.cart.findOne({
      userId: new ObjectId(id),
    });
    return cart;
  }
  async findByUserId(userId: string): Promise<Cart | null> {
    const userObjectId = new ObjectId(userId);
    const result = await mongodbService.users
      .aggregate([
        {
          $match: { _id: userObjectId },
        },
        {
          $lookup: {
            from: "cart",
            localField: "_id",
            foreignField: "userId",
            as: "cart",
          },
        },
        {
          $unwind: {
            path: "$cart",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "cartitem",
            localField: "cart._id",
            foreignField: "cartId",
            as: "cart.items",
          },
        },
      ])
      .toArray();

    // console.log(JSON.stringify(result, null, 2)); // In ra dễ đọc

    const user = result[0];
    const resultTotal = user.cart;

    // console.log(resultTotal);
    // const cart = await mongodbService.cart.findOne({ userId: new ObjectId(userId) });
    return resultTotal;
  }
  async update(id: string, form: IUpdateCartForm): Promise<Cart> {
    const result = await mongodbService.cart.updateOne(
      { userId: new ObjectId(id) },
      { $set: form }
    );
    if (result.modifiedCount === 0) {
      throw new Error("Update failed");
    }
    const updatedCart = await mongodbService.cart.findOne({
      userId: new ObjectId(id),
    });
    return updatedCart as Cart;
  }
  async updateCartTotals(userId: string): Promise<Cart | null> {
    const cart = await mongodbService.cart.findOne({
      userId: new ObjectId(userId),
    });
    if (!cart) {
      throw new Error("Cart not found");
    }
    const cartItems = await mongodbService.cartitem
      .find({
        cartId: cart._id,
        status: Status.Tick,
      })
      .toArray();

    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.totalPriceCartItem,
      0
    );

    await mongodbService.cart.updateOne(
      { _id: cart._id },
      {
        $set: {
          totalQuantity: totalQuantity,
          totalPrice: totalPrice,
        },
      }
    );
    const updatedCart = await mongodbService.cart.findOne({ _id: cart._id });
    return updatedCart as Cart;
  }
  async UntickCartItem(cartItemId: string): Promise<CartItem> {
    const result = await mongodbService.cartitem.updateOne(
      { _id: new ObjectId(cartItemId) },
      { $set: { status: Status.Untick } }
    );
    if (result.modifiedCount === 0) {
      throw new Error("Update failed");
    }
    const updatedCartItem = await mongodbService.cartitem.findOne({
      _id: new ObjectId(cartItemId),
    });
    return updatedCartItem as CartItem;
  }
  async TickCartItem(cartItemId: string): Promise<CartItem> {
    const result = await mongodbService.cartitem.updateOne(
      { _id: new ObjectId(cartItemId) },
      { $set: { status: Status.Tick } }
    );
    if (result.modifiedCount === 0) {
      throw new Error("Update failed");
    }
    const updatedCartItem = await mongodbService.cartitem.findOne({
      _id: new ObjectId(cartItemId),
    });
    return updatedCartItem as CartItem;
  }
  // async calculateShippingFee(id: string, payload: {
  //   form_district_id: number,
  //   form_ward_code: string,
  //   to_district_id: number,
  //   to_ward_code: string,
  //   Items: {
  //     name: string,
  //     quantity: number,
  //     length: number,
  //     width: number,
  //     height: number,
  //     weight: number
  //   }[]
  // }): Promise<any> {
  //   const cart = await mongodbService.cart.findOne({ userId: new ObjectId(id) });
  //   if (!cart) {
  //     throw new Error("Cart not found");
  //   }
  //   const cartItems = await mongodbService.cartitem.find({ cartId: cart._id }).toArray();
  //   if (!cartItems) {
  //     throw new Error("Cart items not found");
  //   }
  //   for (const item of cartItems) {
  //     console.log(item);
  //     const ghnItems = cartItems.map(async (item) => {
  //       const dim = await getDimensionForProduct(item.nameProductItem);
  //       console.log(dim);
  //       const result = {
  //         name: item.nameProductItem,
  //         quantity: item.quantity,
  //         height: dim.height,
  //         length: dim.length,
  //         width: dim.width,
  //         weight: dim.weight
  //       };
  //       payload.Items.push(result);
  //     });
  //   }
  //   const body = {
  //     "from_district_id": payload.form_district_id,
  //     "from_ward_code": payload.form_ward_code,
  //     "to_district_id": payload.to_district_id,
  //     "to_ward_code": payload.to_ward_code,
  //     "service_id": appConfig.GHN.serviceId,
  //     "insurance_value": cart.totalPrice || 0,
  //     "coupon": null,
  //     "weight": 0,
  //     "length": 0,
  //     "width": 0,
  //     "height": 0,
  //     "items": payload.Items
  //   }
  //   return body;
  // }
  async calculateShippingFee(
    id: string,
    payload: {
      from_district_id: number;
      from_ward_code: string;
      to_district_id: number;
      to_ward_code: string;
    }
  ): Promise<any> {
    const cart = await mongodbService.cart.findOne({
      userId: new ObjectId(id),
    });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItems = await mongodbService.cartitem
      .find({ cartId: cart._id, status: Status.Tick })
      .toArray();
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart items not found");
    }

    const items = await Promise.all(
      cartItems.map(async (item) => {
        const dim = await getDimensionForProduct(item.nameProductItem);
        return {
          name: item.nameProductItem,
          quantity: item.quantity,
          height: dim.height,
          length: dim.length,
          width: dim.width,
          weight: dim.weight,
        };
      })
    );

    const totalWeight = items.reduce(
      (sum, item) => sum + item.weight * item.quantity,
      0
    );
    const totalLength = Math.max(...items.map((item) => item.length));
    const totalWidth = Math.max(...items.map((item) => item.width));
    const totalHeight = Math.max(...items.map((item) => item.height));

    const insuranceValue = (cart.totalPrice as number) / 10 || 0;

    const body = {
      from_district_id: payload.from_district_id,
      from_ward_code: payload.from_ward_code,
      to_district_id: payload.to_district_id,
      to_ward_code: payload.to_ward_code,
      service_id: appConfig.GHN.serviceId,
      insurance_value: insuranceValue || 0,
      coupon: "",
      weight: totalWeight,
      length: totalLength,
      width: totalWidth,
      height: totalHeight,
      items,
    };

    return body;
  }
  async calculateTotalFee(
    id: string,
    payload: {
      from_district_id: number;
      from_ward_code: string;
      to_district_id: number;
      to_ward_code: string;
      adress: string;
      phonenumber: string;
    }
  ): Promise<any> {
    const cart = await mongodbService.cart.findOne({
      userId: new ObjectId(id),
    });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItems = await mongodbService.cartitem
      .find({
        cartId: cart._id,
        status: Status.Tick,
      })
      .toArray();
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart items not found");
    }

    const items = await Promise.all(
      cartItems.map(async (item) => {
        const dim = await getDimensionForProduct(item.nameProductItem);
        return {
          name: item.nameProductItem,
          quantity: item.quantity,
          height: dim.height,
          length: dim.length,
          width: dim.width,
          weight: dim.weight,
        };
      })
    );

    const totalWeight = items.reduce(
      (sum, item) => sum + item.weight * item.quantity,
      0
    );
    const totalLength = Math.max(...items.map((item) => item.length));
    const totalWidth = Math.max(...items.map((item) => item.width));
    const totalHeight = Math.max(...items.map((item) => item.height));

    const insuranceValue = (cart.totalPrice as number) / 10 || 0;

    const body = {
      from_district_id: payload.from_district_id,
      from_ward_code: payload.from_ward_code,
      to_district_id: payload.to_district_id,
      to_ward_code: payload.to_ward_code,
      service_id: appConfig.GHN.serviceId,
      insurance_value: insuranceValue || 0,
      coupon: "",
      weight: totalWeight,
      length: totalLength,
      width: totalWidth,
      height: totalHeight,
      items,
    };

    return body;
  }
  async VNPayPayment(
    id: string,
    payload: {
      amount: number;
    }
  ): Promise<any> {
    const user = await mongodbService.users.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error("User not found");
    }
    if (
      typeof payload.amount !== "number" ||
      isNaN(payload.amount) ||
      payload.amount <= 0
    ) {
      throw new Error("Invalid amount");
    }

    const body = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: appConfig.VNP.vnpTmnCode,
      vnp_Amount: Math.round(Number(payload.amount) * 100), // Convert to VND
      vnp_CreateDate: formatDate(new Date()),
      vnp_CurrCode: "VND",
      vnp_IpAddr: "127.0.0.1",
      vnp_Locale: "vn",
      vnp_OrderInfo: "123456",
      vnp_OrderType: "other",
      vnp_TxnRef: new ObjectId().toHexString(), // Unique transaction reference
      vnp_ReturnUrl: encodeURIComponent(appConfig.VNP.vnpReturnUrl), // encodeURIComponent(appConfig.VNP.vnpReturnUrl,

      // vnp_ExpireDate: formatDate(new Date(Date.now() + 15 * 60 * 1000)), // 15 minutes from now
    };

    const sortedParams = sortObject(body);
    const signData = qs.stringify(sortedParams, { encode: false });
    const secretKey = appConfig.VNP.vnpHashSecret;
    if (!secretKey) {
      throw new Error("Missing VNPAY Hash Secret");
    }

    const hmac = crypto.createHmac("sha512", secretKey);
    const signature = hmac.update(signData, "utf-8").digest("hex");

    sortedParams["vnp_SecureHash"] = signature;

    const paymentUrl = `${appConfig.VNP.vnpUrl}?${qs.stringify(sortedParams, {
      encode: false,
    })}`;
    return paymentUrl;
  }
}
