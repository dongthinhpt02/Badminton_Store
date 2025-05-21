import { ObjectId } from "mongodb";
import { ICateRepository, ICateService } from "../interface";
import { Cate, CateForm, createCateSchema, ICreateCateForm, IUpdateCateForm, Status } from "../model";

export class CateService implements ICateService {
    constructor(private readonly cateRepository: ICateRepository) {}

    async create(form: ICreateCateForm): Promise<Cate> {
        const newCate = createCateSchema.parse(form);
        
                const cateToInsert: Cate = {
                    _id : new ObjectId(),
                    nameCate : newCate.nameCate,
                    imageCate : newCate.imageCate,
                    description : newCate.description, 
                    created_at: new Date(),
                    status: Status.ACTIVE,
                    updated_at: null,
                    deleted_at: null,
                    restored_at: null,
                };
        
                const result = await this.cateRepository.insert(cateToInsert);
                return result;
    }

    async update(id: string, form: IUpdateCateForm): Promise<Cate | null> {
        const result = await this.cateRepository.update(id, form);
        return result;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.cateRepository.delete(id);
        return result;
    }
    async restore(id: string): Promise<boolean> {
        const result = await this.cateRepository.restore(id);
        return result;
    }
    async getById(id: string): Promise<Cate | null> {
        const cate = await this.cateRepository.findById(id);
        return cate;
    }

    async getByIdAdmin(id: string): Promise<Cate | null> {
        const cate = await this.cateRepository.findByIdAdmin(id);
        return cate;
    }

    async getByName(nameCate: string): Promise<Cate[] | null> {
        const cate = await this.cateRepository.findByName(nameCate);
        return cate;
    }

    async getByNameAdmin(nameCate: string): Promise<Cate[] | null> {
        const cate = await this.cateRepository.findByNameAdmin(nameCate);
        return cate;
    }

    async getAllCateActive(): Promise<Cate[]> {
        const cates = await this.cateRepository.findAllCateActive();
        return cates;
    }

    async getAllCateInactive(): Promise<Cate[]> {
        const cates = await this.cateRepository.findAllCateInactive();
        return cates;
    }

    async getAllCate(): Promise<Cate[]> {
        const cates = await this.cateRepository.findAllCate();
        return cates;
    }
}