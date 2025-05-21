import { ObjectId } from "mongodb";
import { IDiscountRepository, IDiscountService } from "../interface";
import { Discount, ICreateDiscount, ICreateDiscountForm, Status } from "../model";
import { mongodbService } from "../../../shared/common/mongodb";

export class DiscountService implements IDiscountService {
    constructor(private readonly discountRepository: IDiscountRepository) {}
    async create(form: ICreateDiscountForm): Promise<Discount> {
        const find = await mongodbService.discount.findOne({
            codeDiscount : form.codeDiscount
        });
        if(find){
            throw new Error("Discount code already exists");
        }
        const discountToInsert ={
            _id : new ObjectId(),
            codeDiscount : form.codeDiscount,
            percentDiscount : form.percentDiscount,
            description : form.description,
            status : Status.ACTIVE,
            created_at : new Date(),
            updated_at : null,
            deleted_at : null,
            restored_at : null,
        }
        const result = await this.discountRepository.insert(discountToInsert);
        return result;
    }
    async update (id: string, form: any): Promise<Discount | null> {
        const result = await this.discountRepository.update(id, form);
        return result;
    }
    async delete (id: string): Promise<boolean> {
        const result = await this.discountRepository.delete(id);
        return result;
    }
    async restore (id: string): Promise<boolean> {
        const result = await this.discountRepository.restore(id);
        return result;
    }
    async getById(id: string): Promise<Discount | null> {
        const result = await this.discountRepository.findById(id);
        return result;
    }
    async getByIdAdmin(id: string): Promise<Discount | null> {
        const result = await this.discountRepository.findByIdAdmin(id);
        return result;
    }
    async getByCode(code: string): Promise<Discount | null> {
        const result = await this.discountRepository.findByCode(code);
        return result;
    }
    async getByCodeAdmin(code: string): Promise<Discount | null> {
        const result = await this.discountRepository.findByCodeAdmin(code);
        return result;
    }
    async getAllDiscountActive(): Promise<Discount[]> {
        const result = await this.discountRepository.findAllDiscountActive();
        return result;
    }
    async getAllDiscountInactive(): Promise<Discount[]> {
        const result = await this.discountRepository.findAllDiscountInactive();
        return result;
    }
    async getAllDiscount(): Promise<Discount[]> {
        const result = await this.discountRepository.findAllDiscount();
        return result;
    }
}