import { ObjectId } from "mongodb";
import { z } from "zod";

export const importSchema = z.object({
  _id: z.instanceof(ObjectId),
  supplierId: z.instanceof(ObjectId),
  importDate: z.date(),
  title: z.string(),
  description: z.string().nullable().optional(),
});

export type Import = z.infer<typeof importSchema>;
export type ImportForm = z.infer<typeof importSchema>;

export const createImportSchema = importSchema
  .pick({
    supplierId: true,
    // importDate: true,
    title: true,
    description: true,
  })
  .required();
export type ICreateImportForm = z.infer<typeof createImportSchema>;
