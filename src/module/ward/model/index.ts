import { ObjectId } from "mongodb";
import { z } from "zod";

export const wardSchema = z.object({
    _id : z.instanceof(ObjectId),
    WardCode: z.string(),
    WardName: z.string(),
    DistrictID: z.number(),
  });
  export type Ward = z.infer<typeof wardSchema>;
  