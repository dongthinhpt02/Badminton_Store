import { OrderDetail } from "../model";

export interface IOrderDetailRepository {
    insertOrderDetail(orderDetail: OrderDetail): Promise<OrderDetail>;
    getOrderDetailByOrderId(orderId: string): Promise<OrderDetail[]>; 
}
export interface IOrderDetailService {
    createOrderDetail(orderDetail: OrderDetail): Promise<OrderDetail>;
    getOrderDetailByOrderId(orderId: string): Promise<OrderDetail[]>;
}