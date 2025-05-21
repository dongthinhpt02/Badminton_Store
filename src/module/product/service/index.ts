import { ObjectId } from "mongodb";
import { IProductRepository, IProductService} from "../interface";
import { createProductSchema, ICreateProductForm, IUpdateProductForm, Product, Status } from "../model";

export class ProductService implements IProductService {
    constructor(private readonly productRepository: IProductRepository) {}

    async create(form : ICreateProductForm) : Promise<Product> {
        const fixedForm = {
            ...form,
            brandId: new ObjectId(form.brandId),
            cateId: new ObjectId(form.cateId),
        };
        const newProduct = createProductSchema.parse(fixedForm);

        const productToInsert: Product = {
            _id : new ObjectId(),
            nameProduct : newProduct.nameProduct,
            description : newProduct.description,
            imageProduct : newProduct.imageProduct,
            brandId : newProduct.brandId,
            cateId : newProduct.cateId,
            created_at: new Date(),
            status: Status.ACTIVE,
            updated_at: null,
            deleted_at: null,
            restored_at: null,
        };

        const result = await this.productRepository.insert(productToInsert);
        return result;
    }
    async update(id: string, form: IUpdateProductForm): Promise<Product | null> {
        const result = await this.productRepository.update(id, form);
        return result;
    }
    async delete(id: string): Promise<boolean> {
        const result = await this.productRepository.delete(id);
        return result;
    }
    async restore(id: string): Promise<boolean> {
        const result = await this.productRepository.restore(id);
        return result;
    }
    async getById(id: string): Promise<Product | null> {
        const result = await this.productRepository.findById(id);
        return result;
    }
    async getByIdAdmin(id: string): Promise<Product | null> {
        const result = await this.productRepository.findByIdAdmin(id);
        return result;
    }
    async getByName(nameProduct: string): Promise<Product[] | null> {
        const result = await this.productRepository.findByName(nameProduct);
        return result;
    }
    async getByNameAdmin(nameProduct: string): Promise<Product[] | null> {
        const result = await this.productRepository.findByNameAdmin(nameProduct);
        return result;
    }
    async getAllProductActive(): Promise<Product[]> {
        const result = await this.productRepository.findAllProductActive();
        return result;
    }
    async getAllProductInactive(): Promise<Product[]> {
        const result = await this.productRepository.findAllProductInactive();
        return result;
    }
    async getAllProduct(): Promise<Product[]> {
        const result = await this.productRepository.findAllProduct();
        return result;
    }
}