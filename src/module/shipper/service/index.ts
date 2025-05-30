import { Order, OrderStatus, shipperUpdateDeliveredOrderForm, ShipperUpdateShippedOrderForm } from "../../order/model";
import { OrderDetail } from "../../orderdetail/model";
import { IShipperRepository, IShipperService } from "../interface";

export class ShipperService implements IShipperService {
    constructor(private readonly shipperRepository: IShipperRepository) {}

    async getOrderInProccessing(status: OrderStatus.PROCESSING): Promise<Order[]> {
        const result = await this.shipperRepository.getOrderInProccessing(status);
        return result;
    }

    async takeOrderInProcessing(id: string, shipperId: string, order: ShipperUpdateShippedOrderForm): Promise<Order> {
        const result = await this.shipperRepository.takeOrderInProcessing(id, shipperId, order);
        return result;
    }
    async getAllOrderByShipperId(shipperId: string): Promise<Order[]> {
        const result = await this.shipperRepository.getAllOrderByShipperId(shipperId);
        return result;
    }
    async takeOrderToDelivered(id: string, shipperId: string, form : shipperUpdateDeliveredOrderForm): Promise<Order> {
        const result = await this.shipperRepository.takeOrderToDelivered(id, shipperId, form);
        return result;
    }

    async getAllOrderDeliveredByShipperId(shipperId: string): Promise<Order[]> {
        const result = await this.shipperRepository.getAllOrderDeliveredByShipperId(shipperId);
        return result;
    }
    async getAllOrderCompletedByShipperId(shipperId: string): Promise<Order[]> {
        const result = await this.shipperRepository.getAllOrderCompletedByShipperId(shipperId);
        return result;
    }
    async getAllOrderCancelledByShipperId(shipperId: string): Promise<Order[]> {
        const result = await this.shipperRepository.getAllOrderCancelledByShipperId(shipperId);
        return result;
    }
    async getOrderDetailByOrderIdAndShipperId(orderId: string, shipperId: string): Promise<OrderDetail[] | null> {
        const result = await this.shipperRepository.getOrderDetailByOrderIdAndShipperId(orderId, shipperId);
        return result;
    }
}