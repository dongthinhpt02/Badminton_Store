import { ObjectId } from "mongodb";
import { z } from "zod";

export const provinceSchema = z.object({
    _id : z.instanceof(ObjectId),
    ProvinceID: z.number(),
    ProvinceName: z.string(),
});
export type Province = z.infer<typeof provinceSchema>;
export type ProvinceForm = z.infer<typeof provinceSchema>;
