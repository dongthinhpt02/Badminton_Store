import { ObjectId } from "mongodb";
import { add } from "winston";
import { z } from "zod";

export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const supplierSchema = z.object({
  _id: z.instanceof(ObjectId),
  nameSupplier: z.string().regex(/^[\p{L}0-9 ]+$/u, {
    message: "Supplier name must not contain special characters",
  }),
  address: z.string().nullable().optional(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
  deleted_at: z.date().nullable(),
  restored_at: z.date().nullable(),
  status: z.nativeEnum(Status).default(Status.ACTIVE),
});
export type Supplier = z.infer<typeof supplierSchema>;
export type SupplierForm = z.infer<typeof supplierSchema>;
export const createSupplierSchema = supplierSchema
  .pick({
    nameSupplier: true,
    address: true,
  })
  .required();
export type ICreateSupplierForm = z.infer<typeof createSupplierSchema>;
export const updateSupplierSchema = supplierSchema
  .pick({
    _id: true,
    nameSupplier: true,
    address: true,
    status: true,
    updated_at: true,
  })
  .partial();
export type IUpdateSupplierForm = z.infer<typeof updateSupplierSchema>;
