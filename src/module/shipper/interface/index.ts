// import { Order, OrderStatus, shipperUpdateDeliveredOrderForm, ShipperUpdateShippedOrderForm, UserUpdateCompletedOrderForm } from "../../order/model";
// import { OrderDetail } from "../../orderdetail/model";

// export interface IShipperRepository {
//     getOrderInProccessing(status : OrderStatus.PROCESSING): Promise<Order[]>;
//     takeOrderInProcessing(id : string, shipperId : string, form : ShipperUpdateShippedOrderForm): Promise<Order>;
//     getAllOrderByShipperId(shipperId: string): Promise<Order[]>;
//     takeOrderToDelivered(id: string, shipperId: string, form : shipperUpdateDeliveredOrderForm): Promise<Order>;
//     getAllOrderDeliveredByShipperId(shipperId: string): Promise<Order[]>;
//     getAllOrderCompletedByShipperId(shipperId: string): Promise<Order[]>;
//     getAllOrderCancelledByShipperId(shipperId: string): Promise<Order[]>;
//     getOrderDetailByOrderIdAndShipperId(orderId: string, shipperId: string): Promise<OrderDetail[] | null>;
// }
// export interface IShipperService {
//     getOrderInProccessing(status: OrderStatus.PROCESSING): Promise<Order[]>;
//     takeOrderInProcessing(id: string, shipperId : string, form : ShipperUpdateShippedOrderForm): Promise<Order>;
//     getAllOrderByShipperId(shipperId: string): Promise<Order[]>;
//     takeOrderToDelivered(id: string, shipperId: string, form : shipperUpdateDeliveredOrderForm): Promise<Order>;
//     getAllOrderDeliveredByShipperId(shipperId: string): Promise<Order[]>;
//     getAllOrderCompletedByShipperId(shipperId: string): Promise<Order[]>;
//     getAllOrderCancelledByShipperId(shipperId: string): Promise<Order[]>;
//     getOrderDetailByOrderIdAndShipperId(orderId: string, shipperId: string): Promise<OrderDetail[] | null>;
// }
