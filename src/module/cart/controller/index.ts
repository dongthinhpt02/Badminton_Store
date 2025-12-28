import Elysia, { Context } from "elysia";
import { MdlFactory } from "../../../shared/interface";
import { AuthContext } from "../../../shared/middleware";
import { successResponse } from "../../../shared/utils/response";
import { cartSchema } from "../model";
import { ICartService } from "../interface";
import { ICartItemService } from "../../cartitem/interface";
import { ObjectId } from "mongodb";
import {
  cartItemSchema,
  CreateCartItem,
  createCartItemSchema,
  Status,
  UpdateCartItem,
  updateCartItemSchema,
} from "../../cartitem/model";
import Logger from "../../../shared/utils/logger";
import appConfig from "../../../shared/common/config";
import { responseErr } from "../../../shared/utils/error";
import {
  createVnpayChecksum,
  sortObject,
} from "../../../shared/utils/dateformat";
import { IOrderService } from "../../order/interface";
import { mongodbService } from "../../../shared/common/mongodb";

export class HttpCartController {
  constructor(
    private readonly service: ICartService,
    private readonly cartItemService: ICartItemService,
    private readonly orderSerivce: IOrderService
  ) {}

  private async insertCart(ctx: any) {
    const user_id = ctx.decoded.sub;
    const form = cartSchema.parse(ctx.body);

    const data = await this.service.insertCart(form);

    return successResponse(data, ctx);
  }
  private async insertCartItem(ctx: AuthContext) {
    const body = ctx.body as CreateCartItem;
    const user_id = ctx.decoded.sub;
    const cart = await this.service.getCartById(user_id);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const form = createCartItemSchema.parse({
      ...body,
      _id: new ObjectId(),
      cartId: new ObjectId(cart._id),
      productItemId: new ObjectId(body.productItemId),
    });
    const data = await this.cartItemService.create(form);
    return successResponse(data, ctx);
  }

  private async getCartByUserId(ctx: AuthContext) {
    const user_id = ctx.decoded.sub;
    const data = await this.service.getCartByUserId(user_id);

    return successResponse(data, ctx);
  }

  private async getCartItem(ctx: AuthContext) {
    const user_id = ctx.decoded.sub;
    const data = await this.cartItemService.getAllCartItemByUserId(user_id);
    return successResponse(data, ctx);
  }
  private async updateCartItem(ctx: Context) {
    const id = ctx.query.id;
    Logger.success(id);
    const form = ctx.body as UpdateCartItem;
    const data = await this.cartItemService.update(id, form);
    return successResponse(data, ctx);
  }

  private async updateCartTotals(ctx: AuthContext) {
    const user_id = ctx.decoded.sub;
    const data = await this.service.updateCartTotals(user_id);
    return successResponse(data, ctx);

    // ****************************
    // const userId = ctx.decoded.sub;

    // // Bảo đảm ctx.body là object
    // if (!ctx.body || typeof ctx.body !== "object") {
    //   return {
    //     statusCode: 400,
    //     message: "Invalid request body",
    //   };
    // }

    // const { selectedItems } = ctx.body as { selectedItems: string[] };

    // if (!Array.isArray(selectedItems)) {
    //   return {
    //     statusCode: 400,
    //     message: "selectedItems must be an array",
    //   };
    // }

    // const data = await this.service.updateCartTotals(userId, selectedItems);
    // return successResponse(data, ctx);
  }
  // private async updateCart(ctx: AuthContext) {
  //   const user_id = ctx.decoded.sub;
  //   const form = cartSchema.parse(ctx.body);
  //   const data = await this.service.updateCart(form);
  //   return successResponse(data, ctx);
  // }
  private async UntickCartItem(ctx: AuthContext) {
    const cartItemId = ctx.query.id;
    const data = await this.service.UntickCartItem(cartItemId);
    return successResponse(data, ctx);
  }
  private async TickCartItem(ctx: AuthContext) {
    const cartItemId = ctx.query.id;
    const data = await this.service.TickCartItem(cartItemId);
    return successResponse(data, ctx);
  }
  private async deleteCartItem(ctx: AuthContext) {
    const id = ctx.query.id as string;
    const data = await this.cartItemService.delete(id);
    return successResponse(data, ctx);
  }
  private async calculateShippingFee(ctx: AuthContext) {
    const id = ctx.decoded.sub;
    const payload = ctx.body as {
      from_district_id: number;
      from_ward_code: string;
      to_district_id: number;
      to_ward_code: string;
    };
    const abc = await this.service.calculateShippingFee(id, payload);

    const GHN_TOKEN = appConfig.GHN.token as string;
    const baseURL =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: appConfig.GHN.token || "",
        ShopId: appConfig.GHN.shopId || "",
      },
      body: JSON.stringify({
        from_district_id: abc.from_district_id,
        from_ward_code: abc.from_ward_code,
        to_district_id: abc.to_district_id,
        to_ward_code: abc.to_ward_code,
        service_id: Number(appConfig.GHN.serviceId),
        service_type_id: 2,
        height: abc.height,
        length: abc.length,
        weight: abc.weight,
        width: abc.width,
        insurance_value: abc.insurance_value || 0,
        coupon: "",
        items: abc.items,
      }),
    });
    const resData = await response.json();
    console.log(response.body);
    console.log(resData);
    const totalFee = resData.data.total;

    return successResponse(totalFee, ctx);
  }

  private async calculateTotalCart(ctx: AuthContext) {
    const id = ctx.decoded.sub;
    const payload = ctx.body as {
      from_district_id: number;
      from_ward_code: string;
      to_district_id: number;
      to_ward_code: string;
      address: string;
      phonenumber: string;
    };
    const abc = await this.service.calculateTotalFee(id, payload);
    //  console.log(abc);
    const GHN_TOKEN = appConfig.GHN.token as string;
    const baseURL =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: appConfig.GHN.token || "",
        ShopId: appConfig.GHN.shopId || "",
      },
      body: JSON.stringify({
        from_district_id: abc.from_district_id,
        from_ward_code: abc.from_ward_code,
        to_district_id: abc.to_district_id,
        to_ward_code: abc.to_ward_code,
        service_id: Number(appConfig.GHN.serviceId),
        service_type_id: 2,
        height: abc.height,
        length: abc.length,
        weight: abc.weight,
        width: abc.width,
        insurance_value: abc.insurance_value || 0,
        coupon: "",
        items: abc.items,
      }),
    });
    const resData = await response.json();
    const totalFeeShipping = resData.data.total;
    // console.log(abc);
    const cart = await this.service.getCartByUserId(id);
    if (!cart) {
      throw new Error("Cart not found");
    }
    // const cartItems = await this.cartItemService.getAllCartItemByUserId(id);
    // if (!cartItems) {
    //   throw new Error("Cart items not found");
    // }
    // let totalQuantity = 0;
    // let totalPrice = 0;
    // for (const item of cartItems) {
    //   if (item.status === Status.Tick) {
    //     totalQuantity += item.quantity;
    //     totalPrice += item.totalPriceCartItem;
    //   }
    // }

    const totalFee = cart.totalPrice + totalFeeShipping;

    const findDratOrder = await mongodbService.draftorder.findOne({
      userId: new ObjectId(id),
    });
    if (findDratOrder) {
      await mongodbService.draftorder.deleteMany({
        userId: new ObjectId(id),
      });
    }
    const user = await mongodbService.users.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error("User not found");
    }
    const draft = {
      _id: new ObjectId(),
      userId: new ObjectId(id),
      fullname: user.fullname as string,
      totalQuantity: cart.totalQuantity as number,
      totalCart: cart.totalPrice as number,
      shippingFee: totalFeeShipping as number,
      totalCartOrder: totalFee as number,
      from_district_id: abc.from_district_id as number,
      from_ward_code: abc.from_ward_code as string,
      to_district_id: abc.to_district_id as number,
      to_ward_code: abc.to_ward_code as string,
      phonenumber: payload.phonenumber as string,
      address: payload.address as string,
    };
    const order = await this.orderSerivce.insertDraftOrder(draft);

    return successResponse(
      {
        totalCart: cart.totalPrice,
        shippingFee: totalFeeShipping,
        totalCartOrder: totalFee,
      },
      ctx
    );
  }
  private async VNPayPayment(ctx: AuthContext) {
    const id = ctx.decoded.sub;
    const payload = ctx.body as {
      amount: number;
    };
    const data = await this.service.VNPayPayment(id, payload);
    return successResponse(data, ctx);
  }

  getRoutes(mdlFactory: MdlFactory) {
    const cartsRoute = new Elysia({ prefix: "/cart" })
      .derive(mdlFactory.auth)
      .get("", this.getCartByUserId.bind(this))
      .get("/items", this.getCartItem.bind(this))
      .put("/updatetotal", this.updateCartTotals.bind(this))
      .post("/items/insert", this.insertCartItem.bind(this))
      .put("/items/update", this.updateCartItem.bind(this))
      .put("/items/untick", this.UntickCartItem.bind(this))
      .put("/items/tick", this.TickCartItem.bind(this))
      .post("/calculate-shipping-fee", this.calculateShippingFee.bind(this))
      .post("/calculate-total-cart", this.calculateTotalCart.bind(this))
      // .post("/vnpay-payment", this.VNPayPayment.bind(this))
      .delete("/items/delete", this.deleteCartItem.bind(this));
    return cartsRoute;
  }
}
