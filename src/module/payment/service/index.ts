import { ObjectId } from "mongodb";
import { IPaymentRepository, IPaymentService } from "../interface";
import { IPaymentCreateForm, IUpdatePaymentForm, Payment, Status } from "../model";

export class PaymentService implements IPaymentService {
    constructor(private readonly paymentRepository : IPaymentRepository) { 
    }

    async create(form : IPaymentCreateForm): Promise<Payment> {
        const find = await this.paymentRepository.findByName(form.namePayment);
        if (find) {
            throw new Error("Payment already exists");
        }
        const newPaymentToInsert = {
            _id : new ObjectId(),
            namePayment : form.namePayment,
            status : Status.ACTIVE,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
            restored_at: null,
        }
        const result = await this.paymentRepository.insert(newPaymentToInsert);
        return result;  
    }
    async update(id : string, form : IUpdatePaymentForm): Promise<Payment | null> {
        const result = await this.paymentRepository.update(id, form);
        return result;
    }
    async delete (id : string): Promise<boolean> {
        const result = await this.paymentRepository.delete(id);
        return result;
    }
    async restore (id : string): Promise<boolean> {
        const result = await this.paymentRepository.restore(id);
        return result;
    }
    async getAllPayment(): Promise<Payment[]> {
        const result = await this.paymentRepository.findAllPayment();
        return result;
    }
    async getAllPaymentActive() : Promise<Payment[]> {
        const result = await this.paymentRepository.findAllPaymentActive();
        return result;
    }
    async getAllPaymentInactive() : Promise<Payment[]> {
        const result = await this.paymentRepository.findAllPaymentInactive();
        return result;
    }
    async getById(id: string): Promise<Payment | null> {
        const result = await this.paymentRepository.findById(id);
        return result;
    }
    async getByIdAdmin(id: string): Promise<Payment | null> {
        const result = await this.paymentRepository.findByIdAdmin(id);
        return result;
    }
    async getByName(name: string): Promise<Payment | null> {
        const result = await this.paymentRepository.findByName(name);
        return result;
    }
    async getByNameAdmin(name: string): Promise<Payment | null> {
        const result = await this.paymentRepository.findByNameAdmin(name);
        return result;
    }

}