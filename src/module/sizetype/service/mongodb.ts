import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { ISizeTypeRepository } from "../interface";
import { IUpdateSizeTypeForm, SizeType, Status } from "../model";

export class MongodbSizeTypeRepository implements ISizeTypeRepository {
  async insert(sizetype: SizeType): Promise<SizeType> {
    const result = await mongodbService.sizetype.insertOne(sizetype);
    const found = await mongodbService.sizetype.findOne({
      _id: result.insertedId,
    });
    return found as SizeType;
  }
  async update(
    id: string,
    form: IUpdateSizeTypeForm
  ): Promise<SizeType | null> {
    const result = await mongodbService.sizetype.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...form,
          updated_at: new Date(),
        },
      }
    );
    if (result.modifiedCount === 0) {
      return null;
    }
    const found = await mongodbService.sizetype.findOne({
      _id: new ObjectId(id),
    });
    return found as SizeType;
  }
  async delete(id: string): Promise<boolean> {
    const find = await mongodbService.sizetype.findOne({
      _id: new ObjectId(id),
    });
    if (!find) {
      return false;
    }
    const result = await mongodbService.sizetype.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          deleted_at: new Date(),
          status: Status.INACTIVE,
        },
      }
    );
    return true;
  }
  async restore(id: string): Promise<boolean> {
    const find = await mongodbService.sizetype.findOne({
      _id: new ObjectId(id),
    });
    if (!find) {
      return false;
    }
    const result = await mongodbService.sizetype.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          restored_at: new Date(),
          status: Status.ACTIVE,
        },
      }
    );
    return true;
  }
  async findById(id: string): Promise<SizeType | null> {
    const result = await mongodbService.sizetype.findOne({
      _id: new ObjectId(id),
      status: Status.ACTIVE,
    });
    return result as SizeType | null;
  }
  async findByIdAdmin(id: string): Promise<SizeType | null> {
    const result = await mongodbService.sizetype.findOne({
      _id: new ObjectId(id),
    });
    return result as SizeType | null;
  }
  async findByName(name: string): Promise<SizeType[] | null> {
    const result = await mongodbService.sizetype
      .find({
        nameSizeType: { $regex: name, $options: "i" },
        status: Status.ACTIVE,
      })
      .toArray();
    return result as SizeType[] | null;
  }
  async findByNameAdmin(name: string): Promise<SizeType[] | null> {
    const result = await mongodbService.sizetype
      .find({
        nameSizeType: { $regex: name, $options: "i" },
      })
      .toArray();
    return result as SizeType[] | null;
  }
  async findAllActive(): Promise<SizeType[]> {
    const result = await mongodbService.sizetype
      .find({
        status: Status.ACTIVE,
      })
      .toArray();
    return result as SizeType[];
  }
  async findAllInactive(): Promise<SizeType[]> {
    const result = await mongodbService.sizetype
      .find({
        status: Status.INACTIVE,
      })
      .toArray();
    return result as SizeType[];
  }
  async findAll(): Promise<SizeType[]> {
    const result = await mongodbService.sizetype.find().toArray();
    return result as SizeType[];
  }
}
