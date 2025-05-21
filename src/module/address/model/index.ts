import { ObjectId } from "mongodb";
import { z } from "zod";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export const addressSchema = z.object({
    _id: z.instanceof(ObjectId),
    userId: z.instanceof(ObjectId),
    address: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Address must not contain special characters",
    }),
    city: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "City must not contain special characters",
    }),
    province: z.string().regex(/^[\p{L}0-9 ]+$/u, {
        message: "Province must not contain special characters",
    }),
    phone: z.string().regex(/^\d+$/, {
        message: "Phone must contain only numbers",
    }),
    status: z.nativeEnum(Status).default(Status.ACTIVE),
    created_at: z.date(),
    updated_at: z.date().nullable(),
    deleted_at: z.date().nullable(),
    restored_at: z.date().nullable(),
})
export type Address = z.infer<typeof addressSchema>
export type AddressForm = z.infer<typeof addressSchema>
export const createAddressSchema = addressSchema.pick({
    userId: true,
    address: true,
    city: true,
    province : true,
    phone: true,
}).required()
export type ICreateAddress = z.infer<typeof createAddressSchema>
export const updateAddressSchema = addressSchema.pick({
    userId: true,
    address: true,
    city: true,
    province : true,
    phone: true,
}).partial()
export type IUpdateAddress = z.infer<typeof updateAddressSchema>
