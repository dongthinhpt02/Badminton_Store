import { OrderDetail } from "../../orderdetail/model";
import {
  DraftOrder,
  Order,
  DateRangeForm,
  UpdateDeliveredOrderForm,
} from "../model";

export interface IOrderRepository {
  insertDraftOrder: (draftOrder: DraftOrder) => Promise<DraftOrder>;
  insertOrder: (order: Order) => Promise<Order>;
  getAllOrder: () => Promise<Order[]>;
  getOrderDetail: (orderId: string) => Promise<OrderDetail[]>;
  getAllOrderProcessing: () => Promise<Order[]>;
  // getAllOrderShipped : () => Promise<Order[]>
  getAllOrderDelivered: () => Promise<Order[]>;
  getAllOrderCompleted: () => Promise<Order[]>;
  getAllOrderCancelled: () => Promise<Order[]>;
  getAllOrderCreatedBetweenTime: (
    startDate: Date,
    endDate: Date
  ) => Promise<Order[]>;
  // getAllOrderShippedBetweenTime : (startDate: Date, endDate: Date) => Promise<Order[]>
  getAllOrderDeliveredBetweenTime: (
    startDate: Date,
    endDate: Date
  ) => Promise<Order[]>;
  getAllOrderCompletedBetweenTime: (
    startDate: Date,
    endDate: Date
  ) => Promise<Order[]>;
  getAllOrderByName: (name: string) => Promise<Order[]>;
  getOrderByOrderId(orderId: string): Promise<Order>;
  getAllOrderByUserId(userId: string): Promise<Order[]>;
  // getAllOrderByShipperId (shipperId: string): Promise<Order[]>
  takeOrderToDelivered(id: string): Promise<Order>;

  //////****statistics *//////
  generalStatistic(): Promise<any>;
  statisticByStatus(): Promise<any>;
  statisticByTime(): Promise<any>;
  getTopSellingProductItem(): Promise<any>;
  getBrandStatistics(): Promise<any>;
  getCategoryStatistics(): Promise<any>;

  cancelOrderAdmin(orderId: string): Promise<Order>;
  cancelOrderUser(userId: string, orderId: string): Promise<Order>;
}

export interface IOrderService {
  insertDraftOrder: (draftOrder: DraftOrder) => Promise<DraftOrder>;
  // createOrder : (order : Order) => Promise<Order>;
  getAllOrder: () => Promise<Order[]>;
  getOrderDetail: (orderId: string) => Promise<OrderDetail[]>;
  getAllOrderProcessing: () => Promise<Order[]>;
  // getAllOrderShipped : () => Promise<Order[]>
  getAllOrderDelivered: () => Promise<Order[]>;
  getAllOrderCompleted: () => Promise<Order[]>;
  getAllOrderCancelled: () => Promise<Order[]>;

  getAllOrderCreatedBetweenTime: (
    startDate: Date,
    endDate: Date
  ) => Promise<Order[]>;
  // getAllOrderShippedBetweenTime : (startDate: Date, endDate: Date) => Promise<Order[]>
  getAllOrderDeliveredBetweenTime: (
    startDate: Date,
    endDate: Date
  ) => Promise<Order[]>;
  getAllOrderCompletedBetweenTime: (
    startDate: Date,
    endDate: Date
  ) => Promise<Order[]>;
  getAllOrderByName: (name: string) => Promise<Order[]>;
  getOrderByOrderId(orderId: string): Promise<Order>;
  getAllOrderByUserId(userId: string): Promise<Order[]>;
  // getAllOrderByShipperId (shipperId: string): Promise<Order[]>

  takeOrderToDelivered(id: string): Promise<Order>;

  generalStatistic(): Promise<any>;
  statisticByStatus(): Promise<any>;
  statisticByTime(): Promise<any>;
  getTopSellingProductItem(): Promise<any>;
  getBrandStatistics(): Promise<any>;
  getCategoryStatistics(): Promise<any>;

  cancelOrderAdmin(orderId: string): Promise<Order>;
  cancelOrderUser(userId: string, orderId: string): Promise<Order>;
}
