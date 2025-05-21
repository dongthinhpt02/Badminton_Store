import { ICreateProductItemForm, IUpdateProductItemForm, ProductItem } from "../model";

export interface IProductItemRepository {
    insert: (productItem: ProductItem) => Promise<ProductItem>;
    update: (id: string, form: IUpdateProductItemForm) => Promise<ProductItem | null>;
    delete: (id: string) => Promise<boolean>;
    restore: (id: string) => Promise<boolean>;
    findById: (id: string) => Promise<ProductItem | null>;
    findByIdAdmin: (id: string) => Promise<ProductItem | null>;
    findByName: (nameProductItem: string) => Promise<ProductItem[] | null>;
    findByNameAdmin: (nameProductItem: string) => Promise<ProductItem[] | null>;
    findAllProductItemActive: () => Promise<ProductItem[]>; 
    findAllProductItemInactive: () => Promise<ProductItem[]>;
    findAllProductItem: () => Promise<ProductItem[]>;
    findAllProductItemByBrandId : (brandId: string) => Promise<ProductItem[] | null>;
    findAllProductItemByCateId : (cateId: string) => Promise<ProductItem[] | null>;
    findAllProductItemByProductId : (productId: string) => Promise<ProductItem[] | null>;
    findAllProductItemBySizeId : (sizeId: string) => Promise<ProductItem[] | null>;
    findAllProductItemByColorId : (colorId: string) => Promise<ProductItem[] | null>;
}
export interface IProductItemService {
    create: (form: ICreateProductItemForm) => Promise<ProductItem>;
    update: (id: string, form: IUpdateProductItemForm) => Promise<ProductItem | null>;
    delete: (id: string) => Promise<boolean>;
    restore: (id: string) => Promise<boolean>;
    getById: (id: string) => Promise<ProductItem | null>;
    getByIdAdmin: (id: string) => Promise<ProductItem | null>;
    getByName: (nameProductItem: string) => Promise<ProductItem[] | null>;
    getByNameAdmin: (nameProductItem: string) => Promise<ProductItem[] | null>;
    getAllProductItemActive: () => Promise<ProductItem[]>;
    getAllProductItemInactive: () => Promise<ProductItem[]>;
    getAllProductItem: () => Promise<ProductItem[]>;
    getAllProductItemByBrandId : (brandId: string) => Promise<ProductItem[] | null>;
    getAllProductItemByCateId : (cateId: string) => Promise<ProductItem[] | null>;
    getAllProductItemByProductId : (productId: string) => Promise<ProductItem[] | null>;
    getAllProductItemBySizeId : (sizeId: string) => Promise<ProductItem[] | null>;
    getAllProductItemByColorId : (colorId: string) => Promise<ProductItem[] | null>;
}