import { ObjectId } from "mongodb";
import { IBrandRepository, IBrandService } from "../interface";
import { Brand, BrandForm, createBrandSchema, ICreateBrandForm, IUpdateBrandForm, Status } from "../model";

export class BrandService implements IBrandService {
    constructor(private readonly brandRepository: IBrandRepository) {}
    async create(form: ICreateBrandForm): Promise<Brand> {
        const newBrand = createBrandSchema.parse(form);

        const brandToInsert: Brand = {
            _id : new ObjectId(),
            nameBrand : newBrand.nameBrand,
            imageBrand : newBrand.imageBrand,
            description : newBrand.description,
            country : newBrand.country, 
            created_at: new Date(),
            status: Status.ACTIVE,
            updated_at: null,
            deleted_at: null,
            restored_at: null,
        };

        const result = await this.brandRepository.insert(brandToInsert);
        return result;
    }
    async update(id: string, form: IUpdateBrandForm): Promise<Brand | null> {
        const result = await this.brandRepository.update(id, form);
        return result;
    }
    async delete(id: string): Promise<boolean> {
        const result = await this.brandRepository.delete(id);
        return result;
    }
    async restore(id: string): Promise<boolean> {
        const result = await this.brandRepository.restore(id);
        return result;
    }
    async getById(id: string): Promise<Brand | null> {
        const result = await this.brandRepository.findById(id);
        return result;
    }
    async getByIdAdmin(id: string): Promise<Brand | null> {
        const result = await this.brandRepository.findByIdAdmin(id);
        return result;
    }
    async getByName(brandName: string): Promise<Brand[] | null> {
        const result = await this.brandRepository.findByName(brandName);
        return result;
    }
    async getByNameAdmin(brandName: string): Promise<Brand[] | null> {
        const result = await this.brandRepository.findByNameAdmin(brandName);
        return result;
    }
    async getAllBrandActive(): Promise<Brand[]> {
        const result = await this.brandRepository.findAllBrandActive();
        return result;
    }
    async getAllBrandInactive(): Promise<Brand[]> {
        const result = await this.brandRepository.findAllBrandInactive();
        return result;
    }
    async getAllBrand(): Promise<Brand[]> {
        const result = await this.brandRepository.findAllBrand();
        return result;
    }
}   