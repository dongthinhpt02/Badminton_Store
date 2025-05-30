import { ObjectId } from "mongodb";
import { z } from "zod";

export const orderDetailSchema = z.object({
    _id: z.instanceof(ObjectId),
    orderId: z.instanceof(ObjectId),
    productItemId: z.instanceof(ObjectId),
    // sessionId: z.instanceof(ObjectId),
    nameProductItem: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Tên chi tiết sản phẩm chỉ được chứa chữ cái, số và dấu cách",
    }),
    price: z.number().min(1),
    quantity: z.number().min(1),
    imageProductItem: z.string(),
    totalPriceCartItem: z.number(),
});
export type OrderDetail = z.infer<typeof orderDetailSchema>;
export type OrderDetailForm = z.infer<typeof orderDetailSchema>;