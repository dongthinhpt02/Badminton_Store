import { ObjectId } from "mongodb";
import { z } from "zod";
import { ErrNameBrandInvalid } from "./error";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export const brandSchema = z.object({
    _id: z.instanceof(ObjectId),
    nameBrand: z.string().regex(/^[\p{L}0-9 ]+$/u, ErrNameBrandInvalid.message),
    imageBrand: z.string().nullable().optional(),
    country : z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    status : z.nativeEnum(Status).default(Status.ACTIVE),
    created_at: z.date(),
    updated_at: z.date().nullable(),
    deleted_at : z.date().nullable(),
    restored_at : z.date().nullable(),
});
export type Brand = z.infer<typeof brandSchema>;
export type BrandForm = z.infer<typeof brandSchema>;

export const updateBrandSchema = brandSchema
    .pick({
        _id: true,
        nameBrand: true,
        imageBrand: true,
        country: true,
        description: true,
        status: true,
        updated_at: true,
    })
    .partial()
export type IUpdateBrandForm = z.infer<typeof updateBrandSchema>;
export const createBrandSchema = brandSchema
    .pick({
        nameBrand: true,
        imageBrand: true,
        country: true,
        description: true,
    })
export type ICreateBrandForm = z.infer<typeof createBrandSchema>;