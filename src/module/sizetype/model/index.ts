import { ObjectId } from "mongodb";
import { z } from "zod";

export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const sizeTypeSchema = z.object({
  _id: z.instanceof(ObjectId),
  nameSizeType: z.string().regex(/^[\p{L}0-9 ]+$/u, {
    message: "Tên Loại Size chỉ được chứa chữ cái, số và dấu cách",
  }),
  description: z.string().nullable().optional(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
  deleted_at: z.date().nullable(),
  restored_at: z.date().nullable(),
  status: z.nativeEnum(Status).default(Status.ACTIVE),
});
export type SizeType = z.infer<typeof sizeTypeSchema>;
export type SizeTypeForm = z.infer<typeof sizeTypeSchema>;

export const createSizeTypeSchema = sizeTypeSchema
  .pick({
    nameSizeType: true,
    description: true,
  })
  .required();
export type ICreateSizeTypeForm = z.infer<typeof createSizeTypeSchema>;

export const updateSizeTypeSchema = sizeTypeSchema
  .pick({
    _id: true,
    nameSizeType: true,
    status: true,
    updated_at: true,
  })
  .partial();
export type IUpdateSizeTypeForm = z.infer<typeof updateSizeTypeSchema>;
