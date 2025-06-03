import { ObjectId } from "mongodb";
import { IOrderRepository } from "../interface";
import { DateRangeForm, DraftOrder, Order, OrderStatus } from "../model";
import { mongodbService } from "../../../shared/common/mongodb";
import { OrderDetail } from "../../orderdetail/model";
import app from "../../../app";

export class MongodbOrderRepository implements IOrderRepository {
    async insertDraftOrder(draftOrder: DraftOrder): Promise<DraftOrder> {
        const result = await mongodbService.draftorder.insertOne(draftOrder);
        const find = await mongodbService.draftorder.findOne({ _id: result.insertedId });
        return find as DraftOrder;
    }
    async insertOrder(order: Order): Promise<Order> {
        const result = await mongodbService.order.insertOne(order);
        const find = await mongodbService.order.findOne({ _id: result.insertedId });
        return find as Order;
    }
    async getAllOrder(): Promise<Order[]> {
        const orders = await mongodbService.order.find().toArray();
        return orders as Order[];
    }
    async getOrderDetail(orderId: string): Promise<OrderDetail[]> {
        const OrderDetailList = await mongodbService.order.aggregate([
            {
                $match: {
                    _id: new ObjectId(orderId)
                }
            },
            {
                $lookup: {
                    from: "orderdetail",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderdetail"
                }
            },
        ]).toArray()
        return OrderDetailList as OrderDetail[];
    }
    async getAllOrderProcessing(): Promise<Order[]> {
        const orders = await mongodbService.order.find({ status: OrderStatus.PROCESSING }).toArray();
        return orders as Order[];
    }
    async getAllOrderShipped(): Promise<Order[]> {
        const orders = await mongodbService.order.find({ status: OrderStatus.SHIPPED }).toArray();
        return orders as Order[];
    }
    async getAllOrderDelivered(): Promise<Order[]> {
        const orders = await mongodbService.order.find({ status: OrderStatus.DELIVERED }).toArray();
        return orders as Order[];
    }
    async getAllOrderCompleted(): Promise<Order[]> {
        const orders = await mongodbService.order.find({ status: OrderStatus.COMPLETED }).toArray();
        return orders as Order[];
    }
    async getAllOrderCancelled(): Promise<Order[]> {
        const orders = await mongodbService.order.find({ status: OrderStatus.CANCELLED }).toArray();
        return orders as Order[];
    }
    async getAllOrderCreatedBetweenTime(startDate: Date, endDate: Date): Promise<Order[]> {


        const orders = await mongodbService.order.find({
            // status: OrderStatus.PROCESSING,
            created_at: {
                $gte: startDate,
                $lte: endDate
            }
        }).toArray();

        return orders as Order[];
    }
    async getAllOrderShippedBetweenTime(startDate: Date, endDate: Date): Promise<Order[]> {
        const orders = await mongodbService.order.find({
            // status: OrderStatus.SHIPPED,
            shipped_at: {
                $gte: startDate,
                $lte: endDate
            }
        }).toArray();

        return orders as Order[];
    }
    async getAllOrderDeliveredBetweenTime(startDate: Date, endDate: Date): Promise<Order[]> {
        const orders = await mongodbService.order.find({
            // status: OrderStatus.DELIVERED,
            delivered_at: {
                $gte: startDate,
                $lte: endDate
            }
        }).toArray();

        return orders as Order[];
    }
    async getAllOrderCompletedBetweenTime(startDate: Date, endDate: Date): Promise<Order[]> {
        const orders = await mongodbService.order.find({
            // status: OrderStatus.COMPLETED,
            completed_at: {
                $gte: startDate,
                $lte: endDate
            }
        }).toArray();

        return orders as Order[];
    }
    async getAllOrderByName(name: string): Promise<Order[]> {
        const orders = await mongodbService.order.find({
            fullname: { $regex: name, $options: 'i' }
        }).toArray();
        return orders as Order[];
    }
    async getOrderByOrderId(id: string): Promise<Order> {
        const order = await mongodbService.order.findOne({ _id: new ObjectId(id) });
        return order as Order;
    }
    async getAllOrderByUserId(userId: string): Promise<Order[]> {
        const orders = await mongodbService.order.find({ userId: new ObjectId(userId) }).toArray();
        return orders as Order[];
    }
    async getAllOrderByShipperId(shipperId: string): Promise<Order[]> {
        const orders = await mongodbService.order.find({ shipperId: new ObjectId(shipperId) }).toArray();
        return orders as Order[];
    }
    async generalStatistic(): Promise<any> {
        const orders = mongodbService.order;

        // Tổng số đơn hàng hoàn thành
        const totalOrders = await orders.countDocuments({ status: OrderStatus.COMPLETED });

        // Doanh thu theo phương thức thanh toán (chỉ đơn hoàn thành)
        const revenueByPayment = await orders.aggregate([
            { $match: { status: OrderStatus.COMPLETED } },
            {
                $group: {
                    _id: '$namePayment',
                    totalRevenue: { $sum: '$totalCart' }
                }
            }
        ]).toArray();

        // Doanh thu theo tháng (chỉ đơn hoàn thành)
        const revenueByMonth = await orders.aggregate([
            { $match: { status: OrderStatus.COMPLETED } },
            {
                $group: {
                    _id: {
                        year: { $year: '$created_at' },
                        month: { $month: '$created_at' }
                    },
                    totalRevenue: { $sum: '$totalCart' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]).toArray();

        // Tổng sản phẩm đã bán (chỉ đơn hoàn thành)
        const totalProductsSold = await orders.aggregate([
            { $match: { status: OrderStatus.COMPLETED } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalQuantity' }
                }
            }
        ]).toArray();
        const totalProducts = totalProductsSold[0]?.total || 0;

        // Tổng số user đã mua hàng (chỉ đơn hoàn thành)
        const totalUsers = await orders.distinct('userId', { status: OrderStatus.COMPLETED });

        const result = {
            totalOrders: totalOrders,
            revenueByPayment: revenueByPayment,
            revenueByMonth: revenueByMonth,
            totalProductItemSold: totalProducts,
            totalUsersBought: totalUsers.length
        };

        return result;
    }

    async statisticByStatus(): Promise<any> {
        const statusStats = await mongodbService.order.aggregate([
            { $match: { status: OrderStatus.COMPLETED } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]).toArray();
        return statusStats;
    }
    async statisticByTime(): Promise<any> {
        const orders = mongodbService.order;

        // -------- BY DAY --------
        const byDayRaw = await orders.aggregate([
            { $match: { status: OrderStatus.COMPLETED } },
            {
                $group: {
                    _id: {
                        year: { $year: '$created_at' },
                        month: { $month: '$created_at' },
                        day: { $dayOfMonth: '$created_at' }
                    },
                    totalRevenue: { $sum: '$totalCart' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]).toArray();

        const byDay = byDayRaw.map(item => ({
            date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
            revenue: item.totalRevenue,
            orderCount: item.orderCount
        }));

        // -------- BY MONTH --------
        const byMonthRaw = await orders.aggregate([
            { $match: { status: OrderStatus.COMPLETED } },
            {
                $group: {
                    _id: {
                        year: { $year: '$created_at' },
                        month: { $month: '$created_at' }
                    },
                    totalRevenue: { $sum: '$totalCart' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]).toArray();

        const byMonth = byMonthRaw.map(item => ({
            date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            revenue: item.totalRevenue,
            orderCount: item.orderCount
        }));

        // -------- BY YEAR --------
        const byYearRaw = await orders.aggregate([
            { $match: { status: OrderStatus.COMPLETED } },
            {
                $group: {
                    _id: { year: { $year: '$created_at' } },
                    totalRevenue: { $sum: '$totalCart' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1 } }
        ]).toArray();

        const byYear = byYearRaw.map(item => ({
            date: `${item._id.year}`,
            revenue: item.totalRevenue,
            orderCount: item.orderCount
        }));

        return {
            byDay,
            byMonth,
            byYear
        };
    }
    async getTopSellingProductItem(): Promise<any> {
        const orderDetails = mongodbService.orderdetail;

        // -------- TOP BY QUANTITY SOLD --------
        const topByQuantityRaw = await orderDetails.aggregate([
            {
                $lookup: {
                    from: 'order',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'order'
                }
            },
            { $unwind: '$order' },
            { $match: { 'order.status': OrderStatus.COMPLETED } },
            {
                $group: {
                    _id: '$productItemId',
                    nameProductItem: { $first: '$nameProductItem' },
                    imageProductItem: { $first: '$imageProductItem' },
                    totalQuantitySold: { $sum: '$quantity' }
                }
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 10 }
        ]).toArray();

        const topByQuantity = topByQuantityRaw.map(item => ({
            productItemId: item._id,
            nameProductItem: item.nameProductItem,
            imageProductItem: item.imageProductItem,
            totalQuantitySold: item.totalQuantitySold
        }));

        // -------- TOP BY REVENUE --------
        const topByRevenueRaw = await orderDetails.aggregate([
            {
                $lookup: {
                    from: 'order',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'order'
                }
            },
            { $unwind: '$order' },
            { $match: { 'order.status': OrderStatus.COMPLETED } },
            {
                $group: {
                    _id: '$productItemId',
                    nameProductItem: { $first: '$nameProductItem' },
                    imageProductItem: { $first: '$imageProductItem' },
                    totalRevenue: { $sum: '$totalPriceCartItem' }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 }
        ]).toArray();

        const topByRevenue = topByRevenueRaw.map(item => ({
            productItemId: item._id,
            nameProductItem: item.nameProductItem,
            imageProductItem: item.imageProductItem,
            totalRevenue: item.totalRevenue
        }));

        return {
            topByQuantity,
            topByRevenue
        };
    }
    async getBrandStatistics(): Promise<any> {
        const orderDetails = mongodbService.orderdetail;

        const stats = await orderDetails.aggregate([
            // Join với order để lấy status
            {
                $lookup: {
                    from: 'order',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'order'
                }
            },
            { $unwind: '$order' },
            { $match: { 'order.status': OrderStatus.COMPLETED } },

            // Join với productItem để lấy productId
            {
                $lookup: {
                    from: 'productitem',
                    localField: 'productItemId',
                    foreignField: '_id',
                    as: 'productItem'
                }
            },
            { $unwind: '$productItem' },

            // Join với product để lấy brandId và name
            {
                $lookup: {
                    from: 'product',
                    localField: 'productItem.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },

            // Join với brand để lấy nameBrand
            {
                $lookup: {
                    from: 'brand',
                    localField: 'product.brandId',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            { $unwind: '$brand' },

            // Group theo brand
            {
                $group: {
                    _id: '$brand._id',
                    nameBrand: { $first: '$brand.nameBrand' },
                    imageBrand: { $first: '$brand.imageBrand' },
                    totalQuantitySold: { $sum: '$quantity' },
                    totalRevenue: { $sum: '$totalPriceCartItem' }
                }
            },
            { $sort: { totalQuantitySold: -1 } } // Hoặc totalRevenue nếu muốn sắp xếp theo doanh thu
        ]).toArray();

        return stats.map(item => ({
            brandId: item._id,
            nameBrand: item.nameBrand,
            imageBrand: item.imageBrand,
            totalQuantitySold: item.totalQuantitySold,
            totalRevenue: item.totalRevenue
        }));
    }
    async getCategoryStatistics(): Promise<any> {
        const orderDetails = mongodbService.orderdetail;

        const stats = await orderDetails.aggregate([
            // Join với order để lấy status + totalCart
            {
                $lookup: {
                    from: 'order',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'order'
                }
            },
            { $unwind: '$order' },
            { $match: { 'order.status': OrderStatus.COMPLETED } },

            // Join với productItem để lấy productId
            {
                $lookup: {
                    from: 'productitem',
                    localField: 'productItemId',
                    foreignField: '_id',
                    as: 'productItem'
                }
            },
            { $unwind: '$productItem' },

            // Join với product để lấy cateId
            {
                $lookup: {
                    from: 'product',
                    localField: 'productItem.productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },

            // Join với category để lấy nameCate
            {
                $lookup: {
                    from: 'category',
                    localField: 'product.cateId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },

            // Group theo cate
            {
                $group: {
                    _id: '$category._id',
                    nameCate: { $first: '$category.nameCate' },
                    imageCate: { $first: '$category.imageCate' },
                    totalQuantitySold: { $sum: '$quantity' },
                    totalRevenue: { $sum: '$order.totalCart' } // tổng totalCart từ order
                }
            },
            { $sort: { totalQuantitySold: -1 } } // Hoặc sort theo totalRevenue nếu muốn
        ]).toArray();

        return stats.map(item => ({
            cateId: item._id,
            nameCate: item.nameCate,
            imageCate: item.imageCate,
            totalQuantitySold: item.totalQuantitySold,
            totalRevenue: item.totalRevenue
        }));
    }
    async cancelOrderAdmin(orderId: string): Promise<Order> {
        const find = await mongodbService.order.findOne({ _id: new ObjectId(orderId) })
        if (!find) {
            throw Error("Order not find")
        }
        if (find.status === OrderStatus.CANCELLED) {
            throw Error("Order has been cancelled")
        }
        const cancel = await mongodbService.order.updateOne({ _id: new ObjectId(orderId) },
            { $set: { status: OrderStatus.CANCELLED } });
        const orderItems = await mongodbService.orderdetail.find({ orderId: new ObjectId(orderId) }).toArray();

        for (const item of orderItems) {
            await mongodbService.productitem.updateOne(
                { _id: item.productItemId },
                { $inc: { quantity: item.quantity } }
            );
        }

        const result = await mongodbService.order.findOne({ _id: new ObjectId(orderId) });
        if(!result){
            throw Error("Order not find")
        }

        return result as Order;
    }
    async cancelOrderUser(orderId: string, userId: string): Promise<Order> {
        const find = await mongodbService.order.findOne({
            _id: new ObjectId(orderId),
            userId: new ObjectId(userId)
        })
        if (!find) {
            throw Error("Order not find")
        }
        if (find.status === OrderStatus.CANCELLED) {
            throw Error("Order has been cancelled")
        }
        if (find.status === OrderStatus.COMPLETED) {
            throw Error("Order has been completed")
        }
        const cancel = await mongodbService.order.updateOne({ _id: new ObjectId(orderId), userId: new ObjectId(userId) },
            { $set: { status: OrderStatus.CANCELLED } });
        const result = await mongodbService.order.findOne({ _id: new ObjectId(orderId), userId: new ObjectId(userId) });
        return result as Order;
    }
}