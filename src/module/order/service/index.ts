import { OrderDetail } from "../../orderdetail/model";
import { IOrderRepository, IOrderService } from "../interface";
import {
  DateRangeForm,
  DraftOrder,
  Order,
  UpdateDeliveredOrderForm,
} from "../model";

export class OrderService implements IOrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}
  async insertDraftOrder(draftOrder: DraftOrder): Promise<DraftOrder> {
    const result = await this.orderRepository.insertDraftOrder(draftOrder);
    return result;
  }
  async getAllOrder(): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrder();
    return result;
  }
  async getOrderDetail(orderId: string): Promise<OrderDetail[]> {
    const result = await this.orderRepository.getOrderDetail(orderId);
    return result;
  }
  async getAllOrderProcessing(): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrderProcessing();
    return result;
  }
  // async getAllOrderShipped (): Promise<Order[]> {
  //     const result = await this.orderRepository.getAllOrderShipped();
  //     return result;
  // }
  async getAllOrderDelivered(): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrderDelivered();
    return result;
  }
  async getAllOrderCompleted(): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrderCompleted();
    return result;
  }
  async getAllOrderCancelled(): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrderCancelled();
    return result;
  }
  async getAllOrderCreatedBetweenTime(
    startDate: Date,
    endDate: Date
  ): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrderCreatedBetweenTime(
      startDate,
      endDate
    );
    return result;
  }
  // async getAllOrderShippedBetweenTime (startDate: Date, endDate: Date) : Promise<Order[]> {
  //     const result = await this.orderRepository.getAllOrderShippedBetweenTime(startDate, endDate);
  //     return result;
  // }
  async getAllOrderDeliveredBetweenTime(
    startDate: Date,
    endDate: Date
  ): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrderDeliveredBetweenTime(
      startDate,
      endDate
    );
    return result;
  }
  // async getAllOrderCompletedBetweenTime(
  //   startDate: Date,
  //   endDate: Date
  // ): Promise<Order[]> {
  //   const result = await this.orderRepository.getAllOrderCompletedBetweenTime(
  //     startDate,
  //     endDate
  //   );
  //   return result;
  // }
  async getAllOrderCompletedBetweenTime(
    startDate: string,
    endDate: string
  ): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrderCompletedBetweenTime(
      startDate,
      endDate
    );
    return result;
  }
  async getAllOrderByName(name: string): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrderByName(name);
    return result;
  }
  async getOrderByOrderId(orderId: string): Promise<Order> {
    const result = await this.orderRepository.getOrderByOrderId(orderId);
    return result;
  }
  async getAllOrderByUserId(userId: string): Promise<Order[]> {
    const result = await this.orderRepository.getAllOrderByUserId(userId);
    return result;
  }
  // async getAllOrderByShipperId (shipperId: string): Promise<Order[]> {
  //     const result = await this.orderRepository.getAllOrderByShipperId(shipperId);
  //     return result;
  // }
  async takeOrderToDelivered(
    id: string,
    form: UpdateDeliveredOrderForm
  ): Promise<Order> {
    const result = await this.orderRepository.takeOrderToDelivered(id, form);
    return result;
  }
  async generalStatistic(): Promise<any> {
    const result = await this.orderRepository.generalStatistic();
    return result;
  }
  async statisticByStatus(): Promise<any> {
    const result = await this.orderRepository.statisticByStatus();
    return result;
  }
  async statisticByTime(): Promise<any> {
    const result = await this.orderRepository.statisticByTime();
    return result;
  }
  async getTopSellingProductItem(): Promise<any> {
    const result = await this.orderRepository.getTopSellingProductItem();
    return result;
  }
  async getBrandStatistics(): Promise<any> {
    const result = await this.orderRepository.getBrandStatistics();
    return result;
  }
  async getCategoryStatistics(): Promise<any> {
    const result = await this.orderRepository.getCategoryStatistics();
    return result;
  }
  async cancelOrderAdmin(orderId: string): Promise<Order> {
    const result = await this.orderRepository.cancelOrderAdmin(orderId);
    return result;
  }
  async cancelOrderUser(id: string, userId: string): Promise<Order> {
    const result = await this.orderRepository.cancelOrderUser(id, userId);
    return result;
  }
}
