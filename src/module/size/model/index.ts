import { ObjectId } from "mongodb";
import { z } from "zod";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export const sizeSchema = z.object({
    _id: z.instanceof(ObjectId),
    nameSize: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Tên Size chỉ được chứa chữ cái, số và dấu cách",
      }),
    description: z.string().nullable().optional(),
    created_at: z.date(),
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable(),
    restored_at: z.date().nullable(),
    status: z.nativeEnum(Status).default(Status.ACTIVE),
});
export type Size = z.infer<typeof sizeSchema>;
export type SizeForm = z.infer<typeof sizeSchema>;
export const createSizeSchema = sizeSchema
    .pick({
        nameSize: true,
        description: true,
    })
    .required();
export type ICreateSizeForm = z.infer<typeof createSizeSchema>;
export const updateSizeSchema = sizeSchema
    .pick({
        _id: true,
        nameSize: true,
        status: true,
        updated_at: true,
    })
    .partial();
export type IUpdateSizeForm = z.infer<typeof updateSizeSchema>;