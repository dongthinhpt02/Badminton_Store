import { ObjectId } from "mongodb";
import { z } from "zod";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export const ErrNameProductInvalid = {
    message: "Product name must not contain special characters",
    code: "product_name_invalid",
};

export const productSchema = z.object({
    _id: z.instanceof(ObjectId),
    brandId : z.instanceof(ObjectId),
    cateId : z.instanceof(ObjectId),
    nameProduct: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Tên sản phẩm chỉ được chứa chữ cái, số và dấu cách",
      }),
    imageProduct: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    status: z.nativeEnum(Status).default(Status.ACTIVE),
    created_at: z.date(),
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable(),
    restored_at: z.date().nullable(),
});
export type Product = z.infer<typeof productSchema>;
export type ProductForm = z.infer<typeof productSchema>;

export const createProductSchema = productSchema
    .pick({
        brandId : true,
        cateId : true,
        nameProduct: true,
        imageProduct: true,
        description: true,
    })
export type ICreateProductForm = z.infer<typeof createProductSchema>;

export const updateProductSchema = productSchema
    .pick({
        _id: true,
        nameProduct: true,
        imageProduct: true,
        description: true,
        status: true,
        updated_at: true,
    })
    .partial()
export type IUpdateProductForm = z.infer<typeof updateProductSchema>;
