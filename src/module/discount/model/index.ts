import { ObjectId } from "mongodb";
import { z } from "zod";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export const discountSchema = z.object({
    _id: z.instanceof(ObjectId),
    codeDiscount: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Discount code must not contain special characters",
      }),
    percentDiscount: z.number(),
    description: z.string().nullable().optional(),
    status: z.nativeEnum(Status).default(Status.ACTIVE),
    created_at: z.date(),  
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable(),
    restored_at: z.date().nullable(),
});
export type Discount = z.infer<typeof discountSchema>;
export type DiscountForm = z.infer<typeof discountSchema>;
export const createDiscountSchema = discountSchema.pick({
    codeDiscount: true,
    percentDiscount: true,
    description: true
});
export type ICreateDiscount = z.infer<typeof createDiscountSchema>;
export type ICreateDiscountForm = z.infer<typeof createDiscountSchema>;

export const updateDiscountSchema = discountSchema.pick({
    codeDiscount: true,
    percentDiscount: true,
    description: true
}).partial();
export type IUpdateDiscount = z.infer<typeof updateDiscountSchema>;
export type IUpdateDiscountForm = z.infer<typeof updateDiscountSchema>;