import { ObjectId } from "mongodb";
import { z } from "zod";

export const cartSchema = z.object({
    _id : z.instanceof(ObjectId),
    userId : z.instanceof(ObjectId),
    totalQuantity : z.number().nullable().optional(),
    totalPrice : z.number().nullable().optional(),
})
export type Cart = z.infer<typeof cartSchema>;
export type CartForm = z.infer<typeof cartSchema>;

export const updateCartSchema = cartSchema.pick({
    totalQuantity: true,
    totalPrice: true,
});
export type IUpdateCartForm = z.infer<typeof updateCartSchema>;