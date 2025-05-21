import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IPaymentRepository } from "../interface";
import { IUpdatePaymentForm, Payment, Status } from "../model";

export class MongodbPaymentRepository implements IPaymentRepository {
    async insert(payment: Payment): Promise<Payment> {
        const result = await mongodbService.payment.insertOne(payment);
        const find = await mongodbService.payment.findOne({ _id: result.insertedId });
        return find as Payment;   
    }
    async update(id: string, form: IUpdatePaymentForm): Promise<Payment | null> {
        const result = await mongodbService.payment.updateOne({ _id: new ObjectId(id) }, { $set: {
            ...form,
            updated_at: new Date()} });
        if (result.modifiedCount === 0) {
            throw new Error("Update failed");
        }
        const updatedPayment = await mongodbService.payment.findOne({ _id: new ObjectId(id) });
        return updatedPayment as Payment;
    }
    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.payment.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.payment.updateOne({ _id: new ObjectId(id) }, { $set: { deleted_at: new Date(), status: Status.INACTIVE } });
        return true;
    }
    async restore(id: string): Promise<boolean> {
        const find = await mongodbService.payment.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.payment.updateOne({ _id: new ObjectId(id) }, { $set: { restored_at: new Date(), status: Status.ACTIVE } });
        return true;
    }
    async findAllPayment(): Promise<Payment[]> {
        const result = await mongodbService.payment.find().toArray();
        return result as Payment[];
    }
    async findById(id: string): Promise<Payment | null> {
        const result = await mongodbService.payment.findOne({ _id: new ObjectId(id),
            status: Status.ACTIVE
         });
        return result as Payment;
    }
    async findByIdAdmin(id: string): Promise<Payment | null> {
        const result = await mongodbService.payment.findOne({ _id: new ObjectId(id) });
        return result as Payment;
    }
    async findByName(name: string): Promise<Payment | null> {
        const result = await mongodbService.payment.findOne({ namePayment: name,
            status: Status.ACTIVE
         });
        return result as Payment;
    }
    async findByNameAdmin(name: string): Promise<Payment | null> {
        const result = await mongodbService.payment.findOne({ namePayment: name });
        return result as Payment;
    }
    async findAllPaymentActive(): Promise<Payment[]> {
        const result = await mongodbService.payment.find({ status: Status.ACTIVE }).toArray();
        return result as Payment[];
    }
    async findAllPaymentInactive(): Promise<Payment[]> {
        const result = await mongodbService.payment.find({ status: Status.INACTIVE }).toArray();
        return result as Payment[];
    }

}