import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { ISupplierRepository } from "../interface";
import { IUpdateSupplierForm, Status, Supplier } from "../model";

export class MongodbSupplierRepository implements ISupplierRepository {
  async insert(supplier: Supplier): Promise<Supplier> {
    const result = await mongodbService.supplier.insertOne(supplier);
    const found = await mongodbService.supplier.findOne({
      _id: result.insertedId,
    });
    return found as Supplier;
  }
  async update(
    id: string,
    form: IUpdateSupplierForm
  ): Promise<Supplier | null> {
    const result = await mongodbService.supplier.updateOne(
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
    const found = await mongodbService.supplier.findOne({
      _id: new ObjectId(id),
    });
    return found as Supplier;
  }
  async delete(id: string): Promise<boolean> {
    const find = await mongodbService.supplier.findOne({
      _id: new ObjectId(id),
    });
    if (!find) {
      return false;
    }
    const result = await mongodbService.supplier.updateOne(
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
    const find = await mongodbService.supplier.findOne({
      _id: new ObjectId(id),
    });
    if (!find) {
      return false;
    }
    const result = await mongodbService.supplier.updateOne(
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
  async findById(id: string): Promise<Supplier | null> {
    const result = await mongodbService.supplier.findOne({
      _id: new ObjectId(id),
      status: Status.ACTIVE,
    });
    return result as Supplier | null;
  }
  async findByIdAdmin(id: string): Promise<Supplier | null> {
    const result = await mongodbService.supplier.findOne({
      _id: new ObjectId(id),
    });
    return result as Supplier | null;
  }
  async findByName(name: string): Promise<Supplier[] | null> {
    const result = await mongodbService.supplier
      .find({
        nameSupplier: { $regex: name, $options: "i" },
        status: Status.ACTIVE,
      })
      .toArray();
    return result as Supplier[] | null;
  }
  async findByNameAdmin(name: string): Promise<Supplier[] | null> {
    const result = await mongodbService.supplier
      .find({
        nameSupplier: { $regex: name, $options: "i" },
      })
      .toArray();
    return result as Supplier[] | null;
  }
  async findAllActive(): Promise<Supplier[]> {
    const result = await mongodbService.supplier
      .find({
        status: Status.ACTIVE,
      })
      .toArray();
    return result as Supplier[];
  }
  async findAllInactive(): Promise<Supplier[]> {
    const result = await mongodbService.supplier
      .find({
        status: Status.INACTIVE,
      })
      .toArray();
    return result as Supplier[];
  }
  async findAll(): Promise<Supplier[]> {
    const result = await mongodbService.supplier.find({}).toArray();
    return result as Supplier[];
  }
}
