import { ObjectId } from "mongodb";
import { z } from "zod";

export const districtSchema = z.object({
    _id : z.instanceof(ObjectId),
    DistrictID: z.number(),
    DistrictName: z.string(),
    ProvinceID: z.number(),
  });
  export type District = z.infer<typeof districtSchema>;
    export type DistrictForm = z.infer<typeof districtSchema>;  