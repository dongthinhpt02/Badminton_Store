// import Elysia, { Context } from "elysia";
// import { AuthContext } from "../../../shared/middleware/shipper";
// import { successResponse } from "../../../shared/utils/response";
// import { OrderStatus, ShipperUpdateShippedOrder } from "../../order/model";
// import { IShipperService } from "../interface";
// import { IUserService } from "../../user/interface";

// export class HttpShipperController {
//     constructor(private readonly shipperService: IShipperService,
//         private readonly userService : IUserService
//     ) {}

//     private async renewTokenShipper(ctx: AuthContext) {
//         const shipperId = ctx.decoded.sub;
//         const user = await this.userService.renewTokenShipper(shipperId);
//         return successResponse(user, ctx);
//     }
//     private async getOrderInProcessing(ctx : Context) {
//         const orderlist = await this.shipperService.getOrderInProccessing(OrderStatus.PROCESSING);
//         return successResponse(orderlist, ctx);
//     }
//     private async takeOrderInProcessing(ctx: AuthContext) {
//         const shipperId = ctx.decoded.sub;
//         const id = ctx.query.id;
//         const form = ctx.body as ShipperUpdateShippedOrder;
//         const order = await this.shipperService.takeOrderInProcessing(id, shipperId, form);
//         return successResponse(order, ctx);
//     }
//     private async getAllOrderByShipperId(ctx: AuthContext) {
//         const shipperId = ctx.decoded.sub;
//         const orderlist = await this.shipperService.getAllOrderByShipperId(shipperId);
//         return successResponse(orderlist, ctx);
//     }
//     private async takeOrderToDelivered(ctx: AuthContext) {
//         const shipperId = ctx.decoded.sub;
//         const id = ctx.query.id;
//         const form = ctx.body as ShipperUpdateShippedOrder;
//         const order = await this.shipperService.takeOrderToDelivered(id, shipperId, form);
//         return successResponse(order, ctx);
//     }
//     private async getAllOrderDeliveredByShipperId(ctx: AuthContext) {
//         const shipperId = ctx.decoded.sub;
//         const orderlist = await this.shipperService.getAllOrderDeliveredByShipperId(shipperId);
//         return successResponse(orderlist, ctx);
//     }
//     private async getAllOrderCompletedByShipperId(ctx: AuthContext) {
//         const shipperId = ctx.decoded.sub;
//         const orderlist = await this.shipperService.getAllOrderCompletedByShipperId(shipperId);
//         return successResponse(orderlist, ctx);
//     }
//     private async getAllOrderCancelledByShipperId(ctx: AuthContext) {
//         const shipperId = ctx.decoded.sub;
//         const orderlist = await this.shipperService.getAllOrderCancelledByShipperId(shipperId);
//         return successResponse(orderlist, ctx);
//     }
//     private async getOrderDetailByOrderIdAndShipperId(ctx: AuthContext) {
//         const shipperId = ctx.decoded.sub;
//         const id = ctx.query.id;
//         const orderDetail = await this.shipperService.getOrderDetailByOrderIdAndShipperId(id, shipperId);
//         return successResponse(orderDetail, ctx);
//     }
//     getRoutes(mdlFactory: any) {
//         const shipperRoute = new Elysia({ prefix: "/shipper" })
//             .derive(mdlFactory.auth)
//             .get("/renew", this.renewTokenShipper.bind(this))
//             .get("/order-processing", this.getOrderInProcessing.bind(this))
//             .post("/take-order", this.takeOrderInProcessing.bind(this))
//             .get("/all-order", this.getAllOrderByShipperId.bind(this))
//             .get("/order-detail", this.getOrderDetailByOrderIdAndShipperId.bind(this))
//             .post("/take-order-delivered", this.takeOrderToDelivered.bind(this))
//             .get("/all-order-delivered", this.getAllOrderDeliveredByShipperId.bind(this))
//             .get("/all-order-completed", this.getAllOrderCompletedByShipperId.bind(this))
//             .get("/all-order-cancelled", this.getAllOrderCancelledByShipperId.bind(this));
//         return shipperRoute;
//     }
// }
