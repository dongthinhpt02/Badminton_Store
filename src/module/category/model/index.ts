import { z } from "zod";
import { ErrNameCateInvalid } from "./error";
import { ObjectId } from "mongodb";
export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export const cateSchema = z.object({
    _id: z.instanceof(ObjectId),
    nameCate: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Tên danh mục chỉ được chứa chữ cái, số và dấu cách",
      }),
    imageCate: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    status : z.nativeEnum(Status).default(Status.ACTIVE),
    created_at: z.date(),
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable(),
    restored_at: z.date().nullable(),
    });
export type Cate = z.infer<typeof cateSchema>;
export type CateForm = z.infer<typeof cateSchema>;
export const createCateSchema = cateSchema
    .pick({
        nameCate: true,
        imageCate: true,
        description: true,
    })
export type ICreateCateForm = z.infer<typeof createCateSchema>;
export const updateCateSchema = cateSchema
    .pick({
        _id: true,
        nameCate: true,
        imageCate: true,
        description: true,
        status: true,
        updated_at: true,
    })
    .partial()
export type IUpdateCateForm = z.infer<typeof updateCateSchema>;

