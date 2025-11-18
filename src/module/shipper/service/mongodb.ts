// import { ObjectId } from "mongodb";
// import { mongodbService } from "../../../shared/common/mongodb";
// import { Order, OrderStatus, ShipperUpdateShippedOrderForm } from "../../order/model";
// import { IShipperRepository } from "../interface";
// import { OrderDetail } from "../../orderdetail/model";

// export class MongodbShipperRepository implements IShipperRepository {
//     async getOrderInProccessing(status: OrderStatus.PROCESSING): Promise<Order[]> {
//         const orders = await mongodbService.order.find({ status }).toArray();
//         return orders as Order[];
//     }

//     async takeOrderInProcessing(id: string, shipperId: string, form: ShipperUpdateShippedOrderForm): Promise<Order> {
//         // if (ShipperUpdateOrderForm.status !== OrderStatus.PROCESSING) {
//         //     throw new Error("Order is not in processing status");
//         // }
//         const order = await mongodbService.order.findOne({ _id: new ObjectId(id) });
//         if (!order) {
//             throw new Error("Order not found");
//         }
//         if (order.status !== OrderStatus.PROCESSING) {
//             throw new Error("Order is not in processing status");
//         }
//         const result = await mongodbService.order.updateOne(
//             {
//                 _id: new ObjectId(id),
//                 shipperId: null,
//                 status: OrderStatus.PROCESSING
//             },
//             {
//                 $set: {
//                     ...form,
//                     shipperId: new ObjectId(shipperId),
//                     status: OrderStatus.SHIPPED,
//                     shipped_at: new Date()
//                 }
//             }
//         );

//         if (result.modifiedCount === 0) {
//             throw new Error("Failed to take order, maybe already taken by another shipper");
//         }
//         const updatedOrders = await mongodbService.order.findOne({ _id: new ObjectId(id) });
//         return updatedOrders as Order;
//     }
//     async getAllOrderByShipperId(shipperId: string): Promise<Order[]> {
//         const orders = await mongodbService.order.find({ shipperId: new ObjectId(shipperId) }).toArray();
//         return orders as Order[];
//     }
//     async takeOrderToDelivered(id: string, shipperId: string): Promise<Order> {
//         const order = await mongodbService.order.findOne({ _id: new ObjectId(id) });
//         if (!order) {
//             throw new Error("Order not found");
//         }
//         if (order.status !== OrderStatus.SHIPPED || order.shipperId?.toString() !== shipperId) {
//             throw new Error("Order is not in shipped status or not assigned to this shipper");
//         }
//         const result = await mongodbService.order.updateOne(
//             { _id: new ObjectId(id),
//                 shipperId: new ObjectId(shipperId),
//                 status: OrderStatus.SHIPPED },
//             { $set:
//                 { status: OrderStatus.DELIVERED,
//                     delivered_at: new Date() } }
//         );

//         if (result.modifiedCount === 0) {
//             throw new Error("Failed to update order to delivered status");
//         }
//         const updatedOrder = await mongodbService.order.findOne({ _id: new ObjectId(id) });
//         return updatedOrder as Order;
//     }
//     async getAllOrderDeliveredByShipperId(shipperId: string): Promise<Order[]> {
//         const orders = await mongodbService.order.find({ shipperId: new ObjectId(shipperId), status: OrderStatus.DELIVERED }).toArray();
//         return orders as Order[];
//     }
//     async takeOrderCompletedByUserId(id: string, userId: string): Promise<Order> {
//         const order = await mongodbService.order.findOne({ _id: new ObjectId(id) });
//         if (!order) {
//             throw new Error("Order not found");
//         }
//         if (order.status !== OrderStatus.DELIVERED || order.userId?.toString() !== userId) {
//             throw new Error("Order is not in delivered status or not assigned to this user");
//         }
//         const result = await mongodbService.order.updateOne(
//             { _id: new ObjectId(id), userId: new ObjectId(userId), status: OrderStatus.DELIVERED },
//             { $set: { status: OrderStatus.COMPLETED, completed_at: new Date() } }
//         );

//         if (result.modifiedCount === 0) {
//             throw new Error("Failed to update order to completed status");
//         }
//         const updatedOrder = await mongodbService.order.findOne({ _id: new ObjectId(id) });
//         return updatedOrder as Order;
//     }
//     async getAllOrderCancelledByShipperId(shipperId: string): Promise<Order[]> {
//         const orders = await mongodbService.order.find({ shipperId: new ObjectId(shipperId), status: OrderStatus.CANCELLED }).toArray();
//         return orders as Order[];
//     }
//     async getAllOrderCompletedByShipperId(shipperId: string): Promise<Order[]> {
//         const orders = await mongodbService.order.find({ shipperId: new ObjectId(shipperId), status: OrderStatus.COMPLETED }).toArray();
//         return orders as Order[];
//     }
//     async getOrderDetailByOrderIdAndShipperId(orderId: string, shipperId: string): Promise<OrderDetail[] | null> {
//     //     const check = await mongodbService.order.findOne({
//     //         _id: new ObjectId(orderId),
//     //         shipperId: new ObjectId(shipperId)
//     //     });
//     // if (!check) {
//     //     throw new Error("Order not found or not assigned to this shipper");
//     // }
//     // const orderDetails = await mongodbService.orderdetail.find({ orderId: new ObjectId(orderId) }).toArray();
//     // if (orderDetails.length === 0) {
//     //     return null; // No order details found for this order
//     // }
//     // return orderDetails as OrderDetail[];
//     const OrderDetailList = await mongodbService.order.aggregate([
//         {
//             $match: {
//                 _id: new ObjectId(orderId),
//                 shipperId : new ObjectId(shipperId)
//             }
//         },
//         {
//             $lookup: {
//                 from: "orderdetail",
//                 localField: "_id",
//                 foreignField: "orderId",
//                 as: "orderdetail"
//             }
//         },
//     ]).toArray()
//     return OrderDetailList as OrderDetail[];

//     }
// }
