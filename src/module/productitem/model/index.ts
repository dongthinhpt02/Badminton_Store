import { ObjectId } from "mongodb";
import { z } from "zod";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export const productItemSchema = z.object({
    _id: z.instanceof(ObjectId),
    productId: z.instanceof(ObjectId),
    sizeId: z.instanceof(ObjectId),
    colorId: z.instanceof(ObjectId),
    nameProductItem: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Tên sản phẩm chỉ được chứa chữ cái, số và dấu cách",
    }),
    normalizedNameProductItem: z.string(), // Thêm trường normalized
    imageProductItem: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    quantity: z.number().min(0, {
        message: "Số lượng phải lớn hơn hoặc bằng 0",
    }),
    price: z.number().min(0, {
        message: "Giá phải lớn hơn hoặc bằng 0",
    }),
    created_at: z.date(),
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable(),
    restored_at: z.date().nullable(),
    status: z.nativeEnum(Status).default(Status.ACTIVE),
});

// Các type xuất ra từ schema chính
export type ProductItem = z.infer<typeof productItemSchema>;
export type ProductItemForm = z.infer<typeof productItemSchema>;

// Schema dùng khi tạo sản phẩm mới
export const createProductItemSchema = productItemSchema
    .pick({
        productId: true,
        sizeId: true,
        colorId: true,
        nameProductItem: true,
        imageProductItem: true,
        description : true,
        quantity: true,
        price: true,
    })
    .required();
export type ICreateProductItemForm = z.infer<typeof createProductItemSchema>;

// Schema dùng khi cập nhật sản phẩm
export const updateProductItemSchema = productItemSchema
    .pick({
        _id: true,
        nameProductItem: true,
        imageProductItem: true,
        quantity: true,
        price: true,
        status: true,
        updated_at: true,
    })
    .partial();
export type IUpdateProductItemForm = z.infer<typeof updateProductItemSchema>;
