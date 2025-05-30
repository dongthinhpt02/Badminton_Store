import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IOrderDetailRepository } from "../interface";
import { OrderDetail } from "../model";

export class MongodbOrderDetailRepository implements IOrderDetailRepository {
    async insertOrderDetail(orderDetail: OrderDetail): Promise<OrderDetail> {
        const result = await mongodbService.orderdetail.insertOne(orderDetail);
        const find = await mongodbService.orderdetail.findOne({ _id: result.insertedId });
        return find as OrderDetail;
    }
    async getOrderDetailByOrderId(orderId: string): Promise<OrderDetail[]> {
        const orderDetails = await mongodbService.orderdetail.find({ orderId : new ObjectId(orderId) }).toArray();
        return orderDetails as OrderDetail[];
    }
}