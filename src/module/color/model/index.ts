import { ObjectId } from "mongodb";
import { z } from "zod";
import { ErrNameColorInvalid } from "./error";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export const colorSchema = z.object({
    _id: z.instanceof(ObjectId),
    nameColor: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Tên màu chỉ được chứa chữ cái, số và dấu cách",
      }),
    description : z.string().nullable().optional(),
    status: z.nativeEnum(Status).default(Status.ACTIVE),
    created_at: z.date(),
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable(),
    restored_at: z.date().nullable(),
});
export type Color = z.infer<typeof colorSchema>;
export type ColorForm = z.infer<typeof colorSchema>;

export const createColorSchema = colorSchema
    .pick({
        nameColor: true,
        description: true,
    })
export type ICreateColorForm = z.infer<typeof createColorSchema>;
export const updateColorSchema = colorSchema
    .pick({
        _id: true,
        nameColor: true,
        description: true,
        status: true,
        updated_at: true,
    })
    .partial()
export type IUpdateColorForm = z.infer<typeof updateColorSchema>;
