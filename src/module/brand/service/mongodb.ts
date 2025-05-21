import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IBrandRepository } from "../interface";
import { Brand, IUpdateBrandForm, Status } from "../model";

export class MongodbBrandRepository implements IBrandRepository {
    async insert(brand: Brand): Promise<Brand> {
        const result = await mongodbService.brand.insertOne(brand);
        const found = await mongodbService.brand.findOne({ _id: result.insertedId });
        return found as Brand;
    }
    async update(id: string, form: IUpdateBrandForm): Promise<Brand | null> {
        const result = await mongodbService.brand.updateOne(
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
        const updated = await mongodbService.brand.findOne({ _id: new ObjectId(id) });
        return updated as Brand;
    }
    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.brand.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.brand.updateOne({
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
        const find = await mongodbService.brand.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.brand.updateOne(
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
    async findById(id: string): Promise<Brand | null> {
        const result = await mongodbService.brand.findOne({
            _id: new ObjectId(id),
            status: Status.ACTIVE,
        });
        if (!result) {
            return null;
        }
        return result;
    }
    async findByIdAdmin(id: string): Promise<Brand | null> {
        const result = await mongodbService.brand.findOne({
            _id: new ObjectId(id),
        });
        if (!result) {
            return null;
        }

        return result;
    }
    async findByName(nameBrand: string): Promise<Brand[] | null> {
        const result = await mongodbService.brand.find({
            nameBrand: { $regex: nameBrand, $options: 'i' },
            status: Status.ACTIVE,
        }).toArray();
        if (!result) {
            return null;
        }
        return result;
    }
    async findByNameAdmin(nameBrand: string): Promise<Brand[] | null> {
        const result = await mongodbService.brand.find({
            nameBrand: { $regex: nameBrand, $options: 'i' },
        }).toArray();
        if (!result) {
            return null;
        }
        return result;
    }
    async findAllBrandActive(): Promise<Brand[]> {
        const result = await mongodbService.brand.find({
            status: Status.ACTIVE,
        }).toArray();
        return result;
    }
    async findAllBrandInactive(): Promise<Brand[]> {
        const result = await mongodbService.brand.find({
            status: Status.INACTIVE,
        }).toArray();
        return result;
    }
    async findAllBrand(): Promise<Brand[]> {
        const result = await mongodbService.brand.find({}).toArray();
        return result;
    }
}