import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IColorRepository } from "../interface";
import { Color, IUpdateColorForm, Status } from "../model";

export class MongodbColorRepository implements IColorRepository {
    async insert(color: Color): Promise<Color> {
        const result = await mongodbService.color.insertOne(color);
        const found = await mongodbService.color.findOne({ _id: result.insertedId });
        return found as Color;
    }
    async update(id: string, form: IUpdateColorForm): Promise<Color | null> {
        const result = await mongodbService.color.updateOne(
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
        const updated = await mongodbService.color.findOne({ _id: new ObjectId(id) });
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.color.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.color.updateOne({
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
        const find = await mongodbService.color.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.color.updateOne(
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

    async findById(id: string): Promise<any> {
        const result = await mongodbService.color.findOne(
            {
                _id: new ObjectId(id), 
                status: Status.ACTIVE,
            });
        return result;
    }
    async findByIdAdmin(id: string): Promise<Color | null> {
        const result = await mongodbService.color.findOne({ _id: new ObjectId(id) });
        return result;
    }
    async findByName(nameColor: string): Promise<Color[] | null> {
        const result = await mongodbService.color.find({
            nameColor:  { $regex: nameColor, $options: 'i' },
            status: Status.ACTIVE,
        }).toArray();
        return result;
    }
    async findByNameAdmin(nameColor: string): Promise<Color[] | null> {
        const result = await mongodbService.color.find({
            nameColor:  { $regex: nameColor, $options: 'i' },
        }).toArray();
        return result;
    }
    async findAllColorActive(): Promise<any[]> {
        const result = await mongodbService.color.find({
            status: Status.ACTIVE,
        }).toArray();
        return result;
    }
    async findAllColorInactive(): Promise<any[]> {
        const result = await mongodbService.color.find({
            status: Status.INACTIVE,
        }).toArray();
        return result;
    }
    async findAllColor(): Promise<any[]> {
        const result = await mongodbService.color.find({}).toArray();
        return result;
    }
}