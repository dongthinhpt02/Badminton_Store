import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { Import } from "../model";
import { IImportRepository } from "../interface";

export class MongodbImportRepository implements IImportRepository {
  async insert(name: Import): Promise<Import> {
    const result = await mongodbService.import.insertOne(name);
    const found = await mongodbService.import.findOne({
      _id: result.insertedId,
    });
    return found as Import;
  }
  async findById(id: string): Promise<Import | null> {
    const result = await mongodbService.import.findOne({
      _id: new ObjectId(id),
    });
    return result as Import | null;
  }
  async findAll(): Promise<Import[]> {
    const result = await mongodbService.import.find().toArray();
    return result as Import[];
  }
  async findByTitle(title: string): Promise<Import[] | null> {
    const result = await mongodbService.import
      .find({ title: { $regex: title, $options: "i" } })
      .toArray();
    return result as Import[] | null;
  }
  async findByTimeRange(start: Date, end: Date): Promise<Import[] | null> {
    const result = await mongodbService.import
      .find({ importDate: { $gte: start, $lte: end } })
      .toArray();
    return result as Import[] | null;
  }
}
