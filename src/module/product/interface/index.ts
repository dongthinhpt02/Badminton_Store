import { ICreateProductForm, IUpdateProductForm, Product } from "../model";

export interface IProductRepository {
    insert: (product: Product) => Promise<Product>;
    update: (id: string, form: IUpdateProductForm) => Promise<Product | null>;
    delete: (id: string) => Promise<boolean>;
    restore: (id: string) => Promise<boolean>;
    findById: (id: string) => Promise<Product | null>;
    findByIdAdmin: (id: string) => Promise<Product | null>;
    findByName: (nameProduct: string) => Promise<Product[] | null>;
    findByNameAdmin: (nameProduct: string) => Promise<Product[] | null>;
    findAllProductActive: () => Promise<Product[]>;
    findAllProductInactive: () => Promise<Product[]>;
    findAllProduct: () => Promise<Product[]>;
}
export interface IProductService {
    create: (form: ICreateProductForm) => Promise<Product>;
    update: (id: string, form: IUpdateProductForm) => Promise<Product | null>;
    delete: (id: string) => Promise<boolean>;
    restore: (id: string) => Promise<boolean>;
    getById: (id: string) => Promise<Product | null>;
    getByIdAdmin: (id: string) => Promise<Product | null>;
    getByName: (nameProduct: string) => Promise<Product[] | null>;
    getByNameAdmin: (nameProduct: string) => Promise<Product[] | null>;
    getAllProductActive: () => Promise<Product[]>;
    getAllProductInactive: () => Promise<Product[]>;
    getAllProduct: () => Promise<Product[]>;
}