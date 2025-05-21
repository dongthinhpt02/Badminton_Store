import { ObjectId } from "mongodb";
import { ISizeRepository, ISizeService } from "../interface";
import { createSizeSchema, ICreateSizeForm, IUpdateSizeForm, Size, SizeForm, Status } from "../model";

export class SizeService implements ISizeService{
    constructor(private readonly sizeRepository: ISizeRepository) {}
    async create(form : ICreateSizeForm): Promise<Size> {
        const newSize = createSizeSchema.parse(form);
                
                        const sizeToInsert: Size = {
                            _id : new ObjectId(),
                            nameSize : newSize.nameSize,
                            description : newSize.description, 
                            created_at: new Date(),
                            status: Status.ACTIVE,
                            updated_at: null,
                            deleted_at: null,
                            restored_at: null,
                        };
                
                        const result = await this.sizeRepository.insert(sizeToInsert);
                        return result;
    }
    async update(id: string, form: IUpdateSizeForm): Promise<Size | null> {
        const result = await this.sizeRepository.update(id, form);
        return result;
    }
    async delete(id: string): Promise<boolean> {
        const result = await this.sizeRepository.delete(id);
        return result;
    }
    async restore(id: string): Promise<boolean> {
        const result = await this.sizeRepository.restore(id);
        return result;
    }
    async getById(id: string): Promise<Size | null> {
        const result = await this.sizeRepository.findById(id);
        return result;
    }
    async getByIdAdmin(id: string): Promise<Size | null> {
        const result = await this.sizeRepository.findByIdAdmin(id);
        return result;
    }
    async getByName(name: string): Promise<Size[] | null> {
        const result = await this.sizeRepository.findByName(name);
        return result;
    }
    async getByNameAdmin(name: string): Promise<Size[] | null> {
        const result = await this.sizeRepository.findByNameAdmin(name);
        return result;
    }
    async getAllActive(): Promise<Size[]> {
        const result = await this.sizeRepository.findAllActive();
        return result;
    }
    async getAllInactive(): Promise<Size[]> {
        const result = await this.sizeRepository.findAllInactive();
        return result;
    }
    async getAll(): Promise<Size[]> {
        const result = await this.sizeRepository.findAll();
        return result;
    }
}
