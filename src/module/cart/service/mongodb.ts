import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { ICartRepository } from "../interface";
import { Cart, cartSchema, IUpdateCartForm } from "../model";
import { CartItem } from "../../cartitem/model";
import appConfig from "../../../shared/common/config";
import { getDimensionForProduct } from "../../../shared/common/type";

export class MongodbCartRepository implements ICartRepository {
  async insert(cart: Cart): Promise<Cart> {

    const result = await mongodbService.cart.insertOne(cart);

    const found = await mongodbService.cart.findOne({ _id: result.insertedId });

    return found as Cart;
  }
  async findById(id: string): Promise<Cart | null> {
    const cart = await mongodbService.cart.findOne({ userId: new ObjectId(id) });
    return cart;
  }
  async findByUserId(userId: string): Promise<Cart | null> {
    const userObjectId = new ObjectId(userId);
    const result = await mongodbService.users.aggregate([
      {
        $match: { _id: userObjectId }
      },
      {
        $lookup: {
          from: "cart",
          localField: "_id",
          foreignField: "userId",
          as: "cart"
        }
      },
      {
        $unwind: {
          path: "$cart",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "cartitem",
          localField: "cart._id",
          foreignField: "cartId",
          as: "cart.items"
        }
      }
    ]).toArray();

    // console.log(JSON.stringify(result, null, 2)); // In ra dễ đọc

    const user = result[0]
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
    const updatedCart = await mongodbService.cart.findOne({ userId: new ObjectId(id) });
    return updatedCart as Cart;
  }
  async updateCartTotals(userId: string): Promise<Cart | null> {

    const cart = await mongodbService.cart.findOne({ userId: new ObjectId(userId) });
    if (!cart) {
      throw new Error("Cart not found");
    }
    const cartItems = await mongodbService.cartitem.find({ cartId: cart._id }).toArray();
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPriceCartItem, 0);

    await mongodbService.cart.updateOne(
      { _id: cart._id },
      {
        $set: {
          totalQuantity: totalQuantity,
          totalPrice: totalPrice,
        }
      }
    );
    const updatedCart = await mongodbService.cart.findOne({ _id: cart._id });
    return updatedCart as Cart;
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
  async calculateShippingFee(id: string, payload: {
    from_district_id: number,
    from_ward_code: string,
    to_district_id: number,
    to_ward_code: string
  }): Promise<any> {
    const cart = await mongodbService.cart.findOne({ userId: new ObjectId(id) });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const cartItems = await mongodbService.cartitem.find({ cartId: cart._id }).toArray();
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart items not found");
    }

    const items = await Promise.all(cartItems.map(async (item) => {
      const dim = await getDimensionForProduct(item.nameProductItem);
      return {
        name: item.nameProductItem,
        quantity: item.quantity,
        height: dim.height,
        length: dim.length,
        width: dim.width,
        weight: dim.weight
      };
    }));
    const totalWeight = items.reduce((sum, item) => sum + item.weight * item.quantity, 0);
    const totalLength = Math.max(...items.map(item => item.length));
    const totalWidth = Math.max(...items.map(item => item.width));
    const totalHeight = items.reduce((sum, item) => sum + item.height * item.quantity, 0);

    const body = {
      from_district_id: payload.from_district_id,
      from_ward_code: payload.from_ward_code,
      to_district_id: payload.to_district_id,
      to_ward_code: payload.to_ward_code,
      service_id: appConfig.GHN.serviceId,
      insurance_value: cart.totalPrice || 0,
      coupon: null,
      weight: totalHeight,
      length: totalLength,
      width: totalWidth,
      height: totalWeight,
      items
    };

    return body;
  }

}