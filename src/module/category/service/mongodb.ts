import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { ICateRepository } from "../interface";
import { Cate, IUpdateCateForm, Status } from "../model";

export class MongodbCateRepository implements ICateRepository {
    async insert(cate: Cate): Promise<Cate> {
        const result = await mongodbService.cate.insertOne(cate);
        const found = await mongodbService.cate.findOne({ _id: result.insertedId });
        return found as Cate; 
    }

    async update(id: string, form: IUpdateCateForm): Promise<Cate | null> {
        const result = await mongodbService.cate.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    ...form,
                    updated_at: new Date(),
                }
            }
        );
        if (result.modifiedCount === 0) {
            return null;
        }
        const updated = await mongodbService.cate.findOne({ _id: new ObjectId(id) });
        return updated as Cate;
    }

    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.cate.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.cate.updateOne({
            _id: new ObjectId(id),
        }, {
            $set: {
                deleted_at: new Date(),
                status: Status.INACTIVE,
            },
        });
        return true;
    }

    async restore(id: string): Promise<boolean> {
        const find = await mongodbService.cate.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.cate.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    restored_at: new Date(),
                    status: Status.ACTIVE,
                }
            }
        );
        return true;
    }

    async findById(id: string): Promise<Cate | null> {
        const result = await mongodbService.cate.findOne({
            _id: new ObjectId(id),
            status: Status.ACTIVE,
        });
        if (!result) {
            return null;
        }
        return result as Cate;
    }

    async findByIdAdmin(id: string): Promise<Cate | null> {
        const result = await mongodbService.cate.findOne({
            _id: new ObjectId(id),
        });
        if (!result) {
            return null;
        }
        return result as Cate;
    }

    async findByName(nameCate: string): Promise<Cate[] | null> {
        const result = await mongodbService.cate.find({
            nameCate: { $regex: nameCate, $options: 'i' },
            status: Status.ACTIVE,
        }).toArray();
        if (!result) {
            return null;
        }
        return result;
    }

    async findByNameAdmin(nameCate: string): Promise<Cate[] | null> {
        const result = await mongodbService.cate.find({
            nameCate: { $regex: nameCate, $options: 'i' },
        }).toArray();
        if (!result) {
            return null;
        }
        return result;
    }

    async findAllCateActive(): Promise<Cate[]> {
        const result = await mongodbService.cate.find({
            status: Status.ACTIVE,
        }).toArray();
        return result as Cate[];
    }
    async findAllCateInactive(): Promise<Cate[]> {
        const result = await mongodbService.cate.find({
            status: Status.INACTIVE,
        }).toArray();
        return result as Cate[];
    }
    async findAllCate(): Promise<Cate[]> {
        const result = await mongodbService.cate.find({}).toArray();
        return result as Cate[];
    }
}