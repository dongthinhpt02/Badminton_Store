import { ObjectId } from "mongodb";
import { z } from "zod";

export const cartItemSchema = z.object({
    _id: z.instanceof(ObjectId),
    cartId: z.instanceof(ObjectId),
    productItemId: z.instanceof(ObjectId),
    // sessionId: z.instanceof(ObjectId),
    nameProductItem: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Tên chi tiết sản phẩm chỉ được chứa chữ cái, số và dấu cách",
    }),
    price: z.number().min(1),
    quantity: z.number().min(1),
    imageProductItem: z.string(),
    totalPriceCartItem: z.number(),
})
export type CartItem = z.infer<typeof cartItemSchema>;
export type CateItemForm = z.infer<typeof cartItemSchema>;

export const updateCartItemSchema = cartItemSchema.pick({
    quantity: true,
    // totalPriceCartItem: true,
}).required();
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;
export type UpdateCartItemForm = z.infer<typeof updateCartItemSchema>;

export const createCartItemSchema = cartItemSchema.pick({
    cartId: true,
    productItemId: true,
    nameProductItem: true,
    price: true,
    quantity: true,
    imageProductItem: true,
}).required()
// .transform((val)=>{
//     return{
//         ...val,
//         productItemId : val.productItemId,
//         cartId : val.cartId,
//     }
// })
;

export type CreateCartItem = z.infer<typeof createCartItemSchema>;
export type CreateCartItemForm = z.infer<typeof createCartItemSchema>;




