import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IAddressRepository } from "../interface";
import { Address, Status } from "../model";

export class MongodbAddressRepository implements IAddressRepository {
    async insert(address: Address): Promise<Address> {
        const result = await mongodbService.address.insertOne(address);
        const found = await mongodbService.address.findOne({ _id: result.insertedId });
        return found as Address;
    }
    async update(id: string, form: any): Promise<Address | null> {
        const result = await mongodbService.address.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...form,
                    updated_at: new Date()
                }
            }
        );
        if (result.modifiedCount === 0) {
            throw new Error("Update failed");
        }
        const updatedAddress = await mongodbService.address.findOne({ _id: new ObjectId(id) });
        return updatedAddress as Address;
    }
    async findAllAddressByUserId(userId: string): Promise<Address[]> {
        const result = await mongodbService.address.find({ userId: new ObjectId(userId) }).toArray();
        return result as Address[];
    }
    async findAllAddress(): Promise<Address[]> {
        const result = await mongodbService.address.find().toArray();
        return result as Address[];
    }
    async findAddressById(): Promise<Address[]> {
        const result = await mongodbService.address.find().toArray();
        return result as Address[];
    }
}