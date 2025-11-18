import { ObjectId } from "mongodb";
import { z } from "zod";

export enum OrderStatus {
  PROCESSING = "processing",
  //   SHIPPED = "shipped",
  DELIVERED = "delivered",
  COMPLETED = "completeted",
  CANCELLED = "cancelled",
}

export const orderSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  fullname: z.string(),
  totalQuantity: z.number().int().nonnegative(),
  totalCart: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  totalCartOrder: z.number().nonnegative(),
  address: z.string(),
  phonenumber: z.string(),
  status: z.nativeEnum(OrderStatus),
  //   shipperId: z.instanceof(ObjectId).nullable(),
  namePayment: z.string(),
  from_district_id: z.number().int().nonnegative(),
  from_ward_code: z.string(),
  to_district_id: z.number().int().nonnegative(),
  to_ward_code: z.string(),
  cod_amount: z.number().nonnegative(),
  created_at: z.date(),
  // shipped_at: z.date().nullable(),
  delivered_at: z.date().nullable(),
  completed_at: z.date().nullable(),
});
export type Order = z.infer<typeof orderSchema>;

export const updateDeliveredOrderSchemat = orderSchema.pick({
  _id: true,
  status: true,
  delivered_at: true,
});
export type UpdateDeliveredOrderForm = z.infer<
  typeof updateDeliveredOrderSchemat
>;

// export const shipperUpdateShippedOrderSchema = orderSchema.pick({
//   _id: true,
//   //   shipperId: true,
//   status: true,
//   shipped_at: true,
// });
// export type ShipperUpdateShippedOrder = z.infer<
//   typeof shipperUpdateShippedOrderSchema
// >;
// export type ShipperUpdateShippedOrderForm = z.infer<
//   typeof shipperUpdateShippedOrderSchema
// >;

// export const shipperUpdateDeliveredOrderSchema = orderSchema.pick({
//   _id: true,
//   //   shipperId: true,
//   status: true,
//   shipped_at: true,
// });
// export type shipperUpdateDeliveredOrder = z.infer<
//   typeof shipperUpdateDeliveredOrderSchema
// >;
// export type shipperUpdateDeliveredOrderForm = z.infer<
//   typeof shipperUpdateDeliveredOrderSchema
// >;

export const userUpdateCompletedOrderSchema = orderSchema.pick({
  _id: true,
  status: true,
  delivered_at: true,
  completed_at: true,
});
export type UserUpdateCompletedOrder = z.infer<
  typeof userUpdateCompletedOrderSchema
>;
export type UserUpdateCompletedOrderForm = z.infer<
  typeof userUpdateCompletedOrderSchema
>;

export const draftOrderSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  fullname: z.string(),
  totalQuantity: z.number().int().nonnegative(),
  totalCart: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  totalCartOrder: z.number().nonnegative(),
  from_district_id: z.number().int().nonnegative(),
  from_ward_code: z.string(),
  to_district_id: z.number().int().nonnegative(),
  to_ward_code: z.string(),
  phonenumber: z.string(),
  address: z.string(),
  // namePayment : z.enum(["COD", "VNPAY"]).default("COD"),
});
export type DraftOrder = z.infer<typeof draftOrderSchema>;

export const dateRangeSchema = z.object({
  startDate: z.string().datetime(), // yêu cầu format ISO: '2025-05-01T00:00:00Z'
  endDate: z.string().datetime(),
});
export type DateRange = z.infer<typeof dateRangeSchema>;
export type DateRangeForm = z.infer<typeof dateRangeSchema>;
