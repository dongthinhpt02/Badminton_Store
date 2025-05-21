import Elysia, { Context } from "elysia";
import { MdlFactory } from "../../../shared/interface";
import { AuthContext } from "../../../shared/middleware";
import { successResponse } from "../../../shared/utils/response";
import { cartSchema } from "../model";
import { ICartService } from "../interface";
import { ICartItemService } from "../../cartitem/interface";
import { ObjectId } from "mongodb";
import { cartItemSchema, CreateCartItem, createCartItemSchema, UpdateCartItem, updateCartItemSchema } from "../../cartitem/model";
import Logger from "../../../shared/utils/logger";
import appConfig from "../../../shared/common/config";
import { responseErr } from "../../../shared/utils/error";

export class HttpCartController {
  constructor(private readonly service: ICartService,
    private readonly cartItemService: ICartItemService
  ) { }

  private async insertCart(ctx: any) {
    const user_id = ctx.decoded.sub;
    const form = cartSchema.parse(ctx.body);

    const data = await this.service.insertCart(form);

    return successResponse(data, ctx);
  }
  private async insertCartItem(ctx: AuthContext) {
    const body = ctx.body as CreateCartItem;
    const form = createCartItemSchema.parse({
      ...body,
      _id: new ObjectId(),
      cartId: new ObjectId(body.cartId),
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
    const id = ctx.params.id;
    Logger.success(id);
    const form = ctx.body as UpdateCartItem;
    const data = await this.cartItemService.update(id, form);
    return successResponse(data, ctx);
  }

  private async updateCartTotals(ctx: AuthContext) {
    const id = ctx.decoded.sub;
    const data = await this.service.updateCartTotals(id);
    return successResponse(data, ctx);
  }
  // private async updateCart(ctx: AuthContext) {
  //   const user_id = ctx.decoded.sub;
  //   const form = cartSchema.parse(ctx.body);
  //   const data = await this.service.updateCart(form);
  //   return successResponse(data, ctx);
  // }
  private async deleteCartItem(ctx: AuthContext) {
    const id = ctx.params.id;
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
  //  console.log(abc);
    const GHN_TOKEN = appConfig.GHN.token as string;
    const baseURL = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Token": appConfig.GHN.token || "",
        "ShopId": appConfig.GHN.shopId || "",
      },
      body: JSON.stringify({
        "from_district_id": abc.from_district_id,
        "from_ward_code": abc.from_ward_code,
        "to_district_id": abc.to_district_id,
        "to_ward_code": abc.to_ward_code,
        "service_id": Number(appConfig.GHN.serviceId),
        "service_type_id": 2,
        "height": abc.height,
        "length": abc.length,
        "weight": abc.weight,
        "width": abc.width,
        "insurance_value": abc.totalPrice,
        "coupon": "",
        "items": abc.items,
      }),
    });
    const resData = await response.json();
    const totalFee = resData.data.total;
    console.log(totalFee);

    return successResponse(totalFee, ctx);
  }

  getRoutes(mdlFactory: MdlFactory) {
    const cartsRoute = new Elysia({ prefix: "/cart" })
      .derive(mdlFactory.auth)
      .get("", this.getCartByUserId.bind(this))
      .get("/items", this.getCartItem.bind(this))
      .put("/updatetotal", this.updateCartTotals.bind(this))
      .post("/items/insert", this.insertCartItem.bind(this))
      .put("/items/update/:id", this.updateCartItem.bind(this))
      .post("/calculate-shipping-fee", this.calculateShippingFee.bind(this))
      .delete("/items/delete/:id", this.deleteCartItem.bind(this));
    return cartsRoute;
  }
}