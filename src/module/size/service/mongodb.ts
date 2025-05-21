import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { ISizeRepository } from "../interface";
import { IUpdateSizeForm, Size, Status } from "../model";

export class MongodbSizeRepository implements ISizeRepository {
    async insert(size: Size): Promise<Size> {
        const result = await mongodbService.size.insertOne(size);
        const found = await mongodbService.size.findOne({ _id: result.insertedId });
        return found as Size;
    }
    async update(id: string, form: IUpdateSizeForm): Promise<Size | null> {
        const result = await mongodbService.size.updateOne(
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
        const updated = await mongodbService.size.findOne({ _id: new ObjectId(id) });
        return updated as Size;
    }
    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.size.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.size.updateOne({
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
        const find = await mongodbService.size.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.size.updateOne(
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
    async findById(id: string): Promise<Size | null> {
        const result = await mongodbService.size.findOne(
            {
                _id: new ObjectId(id),
                status: Status.ACTIVE
            }
        );
        return result as Size;
    }
    async findByIdAdmin(id: string): Promise<Size | null> {
        const result = await mongodbService.size.findOne(
            {
                _id: new ObjectId(id),
            }
        );
        return result as Size;
    }
    async findByName(nameSize: string): Promise<Size[] | null> {
        const result = await mongodbService.size.find(
            {
                nameSize: { $regex: nameSize, $options: 'i' },
                status: Status.ACTIVE
            }
        ).toArray();
        return result;
    }
    async findByNameAdmin(nameSize: string): Promise<Size[] | null> {
        const result = await mongodbService.size.find(
            {
                nameSize: { $regex: nameSize, $options: 'i' },
            }
        ).toArray();
        return result;
    }
    async findAllActive(): Promise<Size[]> {
        const result = await mongodbService.size.find(
            {
                status: Status.ACTIVE
            }
        );
        return result.toArray() as Promise<Size[]>;
    }
    async findAllInactive(): Promise<Size[]> {
        const result = await mongodbService.size.find(
            {
                status: Status.INACTIVE
            }
        );
        return result.toArray() as Promise<Size[]>;
    }
    async findAll(): Promise<Size[]> {
        const result = await mongodbService.size.find();
        return result.toArray() as Promise<Size[]>;
    }
}