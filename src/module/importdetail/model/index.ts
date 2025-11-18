import { ObjectId } from "mongodb";
import { z } from "zod";

export const importDetailSchema = z.object({
  _id: z.instanceof(ObjectId),
  importId: z.instanceof(ObjectId),
  productItemId: z.instanceof(ObjectId),
  colorId: z.instanceof(ObjectId),
  sizeId: z.instanceof(ObjectId),
  productItemName: z.string(),
  imgProductItem: z.string(),
  quantity: z.number().min(1),
});
export type ImportDetail = z.infer<typeof importDetailSchema>;
export type ImportDetailForm = z.infer<typeof importDetailSchema>;
export const createImportDetailSchema = importDetailSchema
  .pick({
    importId: true,
    productItemId: true,
    colorId: true,
    sizeId: true,
    productItemName: true,
    imgProductItem: true,
    quantity: true,
  })
  .required();
export type ICreateImportDetailForm = z.infer<typeof createImportDetailSchema>;
