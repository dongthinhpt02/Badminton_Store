import { ObjectId } from "mongodb";
import { IProductItemRepository, IProductItemService } from "../interface";
import { ProductItem, IUpdateProductItemForm, Status, ICreateProductItemForm, createProductItemSchema } from "../model";
import { normalizeText } from "../../../shared/utils/normalize";

export class ProductItemService implements IProductItemService {
    constructor(private readonly productItemRepository: IProductItemRepository) {}
    async create(form: ICreateProductItemForm): Promise<ProductItem> {
        const productItemToInsert = {
            _id: new ObjectId(),
            productId: form.productId,
            sizeId: form.sizeId,
            colorId: form.colorId,
            nameProductItem : form.nameProductItem,
            normalizedNameProductItem: normalizeText(form.nameProductItem),
            imageProductItem: form.imageProductItem,
            description: form.description,
            quantity: form.quantity,
            price: form.price,
            status : Status.ACTIVE,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
            restored_at: null,
        };
        const result = await this.productItemRepository.insert(productItemToInsert);
        return result as ProductItem;
    }
    async update(id: string, form: IUpdateProductItemForm): Promise<ProductItem | null> {
        const updatedForm = {
            ...form,
            ...(form.nameProductItem && {
                normalizedNameProductItem: normalizeText(form.nameProductItem),
            }),
            updated_at: new Date(),
        };
        return await this.productItemRepository.update(id, updatedForm) as ProductItem;
    }
    async delete(id: string): Promise<boolean> {
        const result = await this.productItemRepository.delete(id);
        return result;
    }
    async restore(id: string): Promise<boolean> {
        const result = await this.productItemRepository.restore(id);
        return result;
    }
    async getById(id: string): Promise<ProductItem | null> {
        const result = await this.productItemRepository.findById(id);
        return result;
    }
    async getByIdAdmin(id: string): Promise<ProductItem | null> {
        const result = await this.productItemRepository.findByIdAdmin(id);
        return result;
    }
    async getByName(nameProductItem: string): Promise<ProductItem[] | null> {
        const result = await this.productItemRepository.findByName(nameProductItem);
        return result;
    }
    async getByNameAdmin(nameProductItem: string): Promise<ProductItem[] | null> {
        const result = await this.productItemRepository.findByNameAdmin(nameProductItem);
        return result;
    }
    async getAllProductItemActive(): Promise<ProductItem[]> {
        const result = await this.productItemRepository.findAllProductItemActive();
        return result;
    }
    async getAllProductItemInactive(): Promise<ProductItem[]> {
        const result = await this.productItemRepository.findAllProductItemInactive();
        return result;
    }
    async getAllProductItem(): Promise<ProductItem[]> {
        const result = await this.productItemRepository.findAllProductItem();
        return result;
    }
    async getAllProductItemByBrandId(brandId: string): Promise<ProductItem[] | null> {
        const result = await this.productItemRepository.findAllProductItemByBrandId(brandId);
        return result;
    }
    async getAllProductItemByCateId(cateId: string): Promise<ProductItem[] | null> {
        const result = await this.productItemRepository.findAllProductItemByCateId(cateId);
        return result;
    }
    async getAllProductItemByProductId(productId: string): Promise<ProductItem[] | null> {
        const result = await this.productItemRepository.findAllProductItemByProductId(productId);
        return result;
    }
    async getAllProductItemBySizeId(sizeId: string): Promise<ProductItem[] | null> {
        const result = await this.productItemRepository.findAllProductItemBySizeId(sizeId);
        return result;
    }
    async getAllProductItemByColorId(colorId: string): Promise<ProductItem[] | null> {
        const result = await this.productItemRepository.findAllProductItemByColorId(colorId);
        return result;
    }
}