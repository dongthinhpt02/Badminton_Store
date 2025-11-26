import Elysia, { Context } from "elysia";
import { IPaymentService } from "../interface";
import { successResponse } from "../../../shared/utils/response";
import { MdlFactory } from "../../../shared/interface";
import { AuthContext } from "../../../shared/middleware";
import { mongodbService } from "../../../shared/common/mongodb";
import { ObjectId } from "mongodb";
import { Order, OrderStatus } from "../../order/model";
import appConfig from "../../../shared/common/config";
import { getDimensionForOrder } from "../../../shared/common/type";
import axios from "axios";

export class HttpPaymentController {
  constructor(private readonly paymentService: IPaymentService) {}
  private async getById(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.paymentService.getById(id);
    return successResponse(data, ctx);
  }
  private async getByName(ctx: Context) {
    const name = ctx.query.namePayment;
    const data = await this.paymentService.getByName(name);
    return successResponse(data, ctx);
  }
  private async getAllActive(ctx: Context) {
    const data = await this.paymentService.getAllPaymentActive();
    return successResponse(data, ctx);
  }

  private async VNPayPayment(ctx: AuthContext) {
    const id = ctx.decoded.sub;
    const payload = ctx.body as {
      amount: number;
    };
    const data = await this.paymentService.VNPayPayment(id, payload);
    return successResponse(data, ctx);
  }
  private async afterVNPayPayment(ctx: AuthContext) {
    const vnp_Params = ctx.query;
    const user_id = ctx.decoded.sub;
    const user = await mongodbService.users.findOne({
      _id: new ObjectId(user_id),
    });
    if (!user) {
      return new Response(
        JSON.stringify({
          error: "User not found",
          details: vnp_Params,
        }),
        { status: 404 }
      );
    }
    const vnp_status = vnp_Params.vnp_TransactionStatus;
    if (vnp_status !== "00") {
      return new Response(
        JSON.stringify({
          error: "Transaction failed",
          details: vnp_Params,
        }),
        { status: 400 }
      );
    }
    const vnp_TxnRef = vnp_Params.vnp_TxnRef;
    const draft = await mongodbService.draftorder.findOne({
      userId: new ObjectId(user_id),
    });
    if (!draft) {
      return new Response(
        JSON.stringify({
          error: "Draft order not found",
          details: vnp_Params,
        }),
        { status: 404 }
      );
    }

    const order: Order = {
      _id: new ObjectId(),
      userId: new ObjectId(user_id),
      fullname: user.fullname as string,
      totalQuantity: draft.totalQuantity,
      totalCart: draft.totalCart,
      shippingFee: draft.shippingFee,
      totalCartOrder: draft.totalCartOrder,
      address: draft.address,
      phonenumber: draft.phonenumber,
      status: OrderStatus.PROCESSING,
      namePayment: "VNPAY",
      from_district_id: draft.from_district_id,
      from_ward_code: draft.from_ward_code,
      to_district_id: draft.to_district_id,
      to_ward_code: draft.to_ward_code,
      cod_amount: 0,
      created_at: new Date(),
      delivered_at: null,
      completed_at: null,
    };
    const result = await mongodbService.order.insertOne(order);
    const cart = await mongodbService.cart.findOne({
      userId: new ObjectId(user_id),
    });
    const cartItem = await mongodbService.cartitem
      .find({
        cartId: new ObjectId(cart?._id),
      })
      .toArray();
    for (const item of cartItem) {
      const orderDetail = {
        _id: new ObjectId(),
        orderId: new ObjectId(result.insertedId),
        productItemId: new ObjectId(item.productItemId),
        nameProductItem: item.nameProductItem,
        price: item.price,
        quantity: item.quantity,
        imageProductItem: item.imageProductItem,
        totalPriceCartItem: item.totalPriceCartItem,
      };
      await mongodbService.orderdetail.insertOne(orderDetail);
      await mongodbService.productitem.updateOne(
        { _id: new ObjectId(item.productItemId) },
        { $inc: { quantity: -item.quantity } }
      );
    }

    const data = await mongodbService.order.findOne({
      _id: new ObjectId(result.insertedId),
    });
    const updatedCart = await mongodbService.cart.updateOne(
      { userId: new ObjectId(user_id) },
      { $set: { totalPrice: 0, totalQuantity: 0 } }
    );
    const updatedCartItem = await mongodbService.cartitem.deleteMany({
      cartId: new ObjectId(cart?._id),
    });

    const items = await Promise.all(
      cartItem.map(async (items) => {
        const dim = await getDimensionForOrder(items.nameProductItem);
        return {
          name: items.nameProductItem,
          quantity: items.quantity,
          height: dim.height,
          length: dim.length,
          width: dim.width,
          weight: dim.weight,
          category: {
            level1: "phụ kiện",
          },
          // width: number;
          // height: number;
          // length: number;
          // weight: number;
          // category: {
          //     level1: string;
          // }
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

    const insuranceValue = draft.totalCartOrder as number;
    const url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create";
    const headers = {
      "Content-Type": "application/json",
      ShopId: `${appConfig.GHN.shopId}`,
      Token: `${appConfig.GHN.token}`,
    };
    const body = {
      payment_type_id: 2,
      note: "Hàng dễ vỡ xin nhẹ tay",
      required_note: "KHONGCHOXEMHANG",
      from_name: "BadmintonStore",
      from_phone: `${appConfig.PERSONAL.phoneNumber}`,
      from_address: `${appConfig.PERSONAL.address}`,
      from_ward_name: "Phường Long Thạnh Mỹ",
      from_district_name: "Quận 9",
      from_province_name: "HCM",
      // return_phone: `${appConfig.PERSONAL.phoneNumber}`,
      // return_address: "39 NTT",
      // return_district_id: null,
      // return_ward_code: "",
      // client_order_code: "",
      to_name: `${user?.fullname}`,
      to_phone: `${draft.phonenumber}`,
      to_address: `${draft.address}`,
      to_ward_code: `${draft.to_ward_code}`,
      to_district_id: draft.to_district_id,
      cod_amount: 0,
      // content: "Theo New York Times",
      weight: totalWeight,
      length: totalLength,
      width: totalWidth,
      height: totalHeight,
      // pick_station_id: 1444,
      deliver_station_id: null,
      insurance_value: insuranceValue,
      service_id: 0,
      service_type_id: 2,
      coupon: null,
      // pick_shift: [2],
      items,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const dataRes = await response.json();
      const totalResult = { dataRes, data };
      console.log("GHN Response:", totalResult);
      // return successResponse(data, ctx);
    } catch (error) {
      console.error("GHN Error:", error);
      throw error;
    }
    return successResponse(data, ctx);
  }

  private async CODPayment(ctx: AuthContext) {
    const user_id = ctx.decoded.sub;
    const user = await mongodbService.users.findOne({
      _id: new ObjectId(user_id),
    });
    if (!user) {
      return new Response(
        JSON.stringify({
          error: "User not found",
        }),
        { status: 404 }
      );
    }
    const draft = await mongodbService.draftorder.findOne({
      userId: new ObjectId(user_id),
    });
    if (!draft) {
      return new Response(
        JSON.stringify({
          error: "Draft order not found",
        }),
        { status: 404 }
      );
    }

    const order = {
      _id: new ObjectId(),
      userId: new ObjectId(user_id),
      fullname: user.fullname,
      totalQuantity: draft.totalQuantity,
      totalCart: draft.totalCart,
      shippingFee: draft.shippingFee,
      totalCartOrder: draft.totalCartOrder,
      address: draft.address,
      phonenumber: draft.phonenumber,
      status: OrderStatus.PROCESSING,
      namePayment: "COD",
      from_district_id: draft.from_district_id,
      from_ward_code: draft.from_ward_code,
      to_district_id: draft.to_district_id,
      to_ward_code: draft.to_ward_code,
      cod_amount: draft.totalCartOrder,
      created_at: new Date(),
      delivered_at: null,
      completed_at: null,
    };
    const result = await mongodbService.order.insertOne(order);
    const data = await mongodbService.order.findOne({
      _id: new ObjectId(result.insertedId),
    });
    const cart = await mongodbService.cart.findOne({
      userId: new ObjectId(user_id),
    });
    const cartItem = await mongodbService.cartitem
      .find({
        cartId: new ObjectId(cart?._id),
      })
      .toArray();
    for (const item of cartItem) {
      const orderDetail = {
        _id: new ObjectId(),
        orderId: new ObjectId(result.insertedId),
        productItemId: new ObjectId(item.productItemId),
        nameProductItem: item.nameProductItem,
        price: item.price,
        quantity: item.quantity,
        imageProductItem: item.imageProductItem,
        totalPriceCartItem: item.totalPriceCartItem,
      };
      await mongodbService.orderdetail.insertOne(orderDetail);
      await mongodbService.productitem.updateOne(
        { _id: new ObjectId(item.productItemId) },
        { $inc: { quantity: -item.quantity } }
      );
    }

    await mongodbService.cart.updateOne(
      { userId: new ObjectId(user_id) },
      { $set: { totalPrice: 0, totalQuantity: 0 } }
    );
    await mongodbService.cartitem.deleteMany({
      cartId: new ObjectId(cart?._id),
    });

    // Prepare GHN payload
    const items = await Promise.all(
      cartItem.map(async (items) => {
        const dim = await getDimensionForOrder(items.nameProductItem);
        return {
          name: items.nameProductItem,
          quantity: items.quantity,
          height: dim.height,
          length: dim.length,
          width: dim.width,
          weight: dim.weight,
          category: {
            level1: "phụ kiện",
          },
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
    const insuranceValue = (draft.totalCartOrder as number) / 10 || 0;

    const url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create";
    const headers = {
      "Content-Type": "application/json",
      ShopId: `${appConfig.GHN.shopId}`,
      Token: `${appConfig.GHN.token}`,
    };
    const body = {
      payment_type_id: 1, // COD
      note: "Hàng dễ vỡ xin nhẹ tay",
      required_note: "KHONGCHOXEMHANG",
      from_name: "BadmintonStore",
      from_phone: `${appConfig.PERSONAL.phoneNumber}`,
      from_address: `${appConfig.PERSONAL.address}`,
      from_ward_name: "Phường Long Thạnh Mỹ",
      from_district_name: "Quận 9",
      from_province_name: "HCM",
      to_name: `${user?.fullname}`,
      to_phone: `${draft.phonenumber}`,
      to_address: `${draft.address}`,
      to_ward_code: `${draft.to_ward_code}`,
      to_district_id: draft.to_district_id,
      cod_amount: draft.totalCartOrder, // phải là tổng tiền đơn, KHÔNG phải shippingFee
      weight: totalWeight,
      length: totalLength,
      width: totalWidth,
      height: totalHeight,
      insurance_value: insuranceValue,
      service_id: 0,
      service_type_id: 2,
      coupon: null,
      items,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const dataRes = await response.json();
      const totalResult = { dataRes, data };
      console.log("GHN Response:", totalResult);
    } catch (error) {
      console.error("GHN Error:", error);
      throw error;
    }
    return successResponse(data, ctx);
  }

  getRoutes(mdlFactory: MdlFactory) {
    const productRoute = new Elysia({ prefix: "/payment" })
      .derive(mdlFactory.auth)
      .get("", this.getAllActive.bind(this))
      .get("/id", this.getById.bind(this))
      .get("/name", this.getByName.bind(this))
      .post("/vnpay", this.VNPayPayment.bind(this))
      .get("/vnpay/return", this.afterVNPayPayment.bind(this))
      .post("/cod", this.CODPayment.bind(this));
    return productRoute;
  }
}
