import { ObjectId } from "mongodb";
import { z } from "zod";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export const paymentSchema = z.object({
    _id : z.instanceof(ObjectId),
    namePayment : z.string().min(2).regex(/^[\p{L}0-9 ]+$/u, {
        message: "Discount code must not contain special characters",
      }),
    status : z.string(),
    created_at: z.date(),
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable(),
    restored_at: z.date().nullable(),
})
export type Payment = z.infer<typeof paymentSchema>
export type PaymentForm = z.infer<typeof paymentSchema>

export const createPaymentSchema = paymentSchema.pick({
    namePayment : true,
})
export type ICreatePayment = z.infer<typeof createPaymentSchema>
export type IPaymentCreateForm = z.infer<typeof createPaymentSchema>

export const updatePaymentSchema = paymentSchema.pick({
    namePayment : true,
    updated_at : true
})
export type IUpdatePayment = z.infer<typeof updatePaymentSchema>
export type IUpdatePaymentForm = z.infer<typeof updatePaymentSchema>
