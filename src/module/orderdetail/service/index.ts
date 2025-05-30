import { IOrderDetailRepository, IOrderDetailService } from "../interface";
import { OrderDetail } from "../model";

export class OrderDetailService implements IOrderDetailService {
    constructor(private readonly orderDetailRepository: IOrderDetailRepository) {}

    async createOrderDetail(orderDetail: OrderDetail): Promise<OrderDetail> {
        const result = await this.orderDetailRepository.insertOrderDetail(orderDetail);
        return result;
    }
    async getOrderDetailByOrderId(orderId: string): Promise<OrderDetail[]> {
        const orderDetails = await this.orderDetailRepository.getOrderDetailByOrderId(orderId);
        return orderDetails;
    }
}