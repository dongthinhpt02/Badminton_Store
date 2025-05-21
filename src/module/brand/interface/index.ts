import { Brand, ICreateBrandForm, IUpdateBrandForm } from "../model";

export interface IBrandRepository {
    insert: (brand: Brand) => Promise<Brand>;
    update: (id: string, form: IUpdateBrandForm) => Promise<Brand | null>;
    delete : (id: string) => Promise<boolean>;
    restore : (id: string) => Promise<boolean>;
    findById: (id: string) => Promise<Brand | null>;
    findByIdAdmin: (id: string) => Promise<Brand | null>;
    findByName : (brandName: string) => Promise<Brand[] | null>;
    findByNameAdmin : (brandName: string) => Promise<Brand[] | null>;
    findAllBrandActive : () => Promise<Brand[]>;
    findAllBrandInactive : () => Promise<Brand[]>;
    findAllBrand : () => Promise<Brand[]>;
}

export interface IBrandService {
    create: (form: ICreateBrandForm) => Promise<Brand>;
    update: (id: string, form: IUpdateBrandForm) => Promise<Brand | null>;
    delete : (id: string) => Promise<boolean>;
    restore : (id: string) => Promise<boolean>;
    getById: (id: string) => Promise<Brand | null>;
    getByIdAdmin: (id: string) => Promise<Brand | null>;
    getByName : (brandName: string) => Promise<Brand[] | null>;
    getByNameAdmin : (brandName: string) => Promise<Brand[] | null>;
    getAllBrandActive : () => Promise<Brand[]>;
    getAllBrandInactive : () => Promise<Brand[]>;
    getAllBrand : () => Promise<Brand[]>;
}