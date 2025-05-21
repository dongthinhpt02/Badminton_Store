import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IDiscountRepository } from "../interface";
import { Discount, IUpdateDiscount, Status } from "../model";

export class MongodbDiscountRepository implements IDiscountRepository {
    async insert(discount: Discount): Promise<Discount> {
        const result = await mongodbService.discount.insertOne(discount);
        const find = await mongodbService.discount.findOne({ _id: result.insertedId });
        return find as Discount
    }
    async update(id: string, form: IUpdateDiscount): Promise<Discount | null> {
        const result = await mongodbService.discount.updateOne({ _id: new ObjectId(id) }, { $set: {
            ...form,
            updated_at: new Date()} });
        if (result.modifiedCount === 0) {
            throw new Error("Update failed");
        }
        const updatedDiscount = await mongodbService.discount.findOne({ _id: new ObjectId(id) });
        return updatedDiscount as Discount
    }
    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.discount.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.discount.updateOne
            (
                { _id: new ObjectId(id) },
                {
                    $set:
                    {
                        deleted_at: new Date(),
                        status: Status.INACTIVE
                    }
                });
        return true;
    }
    async restore(id: string): Promise<boolean> {
        const find = await mongodbService.discount.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.discount.updateOne
            (
                { _id: new ObjectId(id) },
                {
                    $set:
                    {
                        restored_at: new Date(),
                        status: Status.ACTIVE
                    }
                });
        return true;
    }
    async findById(id: string): Promise<Discount | null> {
        const discount = await mongodbService.discount.findOne(
            {
                _id: new ObjectId(id),
                status: Status.ACTIVE,
            });
        return discount;
    }
    async findByIdAdmin(id: string): Promise<Discount | null> {
        const discount = await mongodbService.discount.findOne(
            {
                _id: new ObjectId(id),
            });
        return discount;
    }
    async findByCode(code: string): Promise<Discount | null> {
        const discount = await mongodbService.discount.findOne(
            {
                codeDiscount: code,
                status: Status.ACTIVE,
            });
        return discount;
    }
    async findByCodeAdmin(code: string): Promise<Discount | null> {
        const discount = await mongodbService.discount.findOne(
            {
                codeDiscount: code,
            });
        return discount;
    }
    async findAllDiscountActive(): Promise<Discount[]> {
        const discount = await mongodbService.discount.find(
            {
                status: Status.ACTIVE,
            }).toArray();
        return discount;
    }
    async findAllDiscountInactive(): Promise<Discount[]> {
        const discount = await mongodbService.discount.find(
            {
                status: Status.INACTIVE,
            }).toArray();
        return discount;
    }
    async findAllDiscount(): Promise<Discount[]> {
        const discount = await mongodbService.discount.find().toArray();
        return discount;
    }
}
