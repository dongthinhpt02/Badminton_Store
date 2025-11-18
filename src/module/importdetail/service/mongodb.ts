import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IImportDetailRepository } from "../interface";
import { ImportDetail } from "../model";

export class MongodbImportDetailRepository implements IImportDetailRepository {
  async insert(importDetail: ImportDetail): Promise<ImportDetail> {
    const result = await mongodbService.importdetail.insertOne(importDetail);
    const found = await mongodbService.importdetail.findOne({
      _id: result.insertedId,
    });
    return found as ImportDetail;
  }
  async findById(id: string): Promise<ImportDetail | null> {
    const result = await mongodbService.importdetail.findOne({
      _id: new ObjectId(id),
    });
    return result as ImportDetail | null;
  }
  async findAll(): Promise<ImportDetail[]> {
    const result = await mongodbService.importdetail.find().toArray();
    return result as ImportDetail[];
  }
  async findByImportId(importId: string): Promise<ImportDetail[] | null> {
    const result = await mongodbService.importdetail
      .find({ importId: new ObjectId(importId) })
      .toArray();
    return result as ImportDetail[] | null;
  }
}
