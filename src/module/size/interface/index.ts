import { ICreateSizeForm, IUpdateSizeForm, Size } from "../model";

export interface ISizeRepository {
    insert: (name: Size) => Promise<Size>;
    update: (id: string, form : IUpdateSizeForm) => Promise<Size | null>;
    delete: (id: string) => Promise<boolean>;
    restore: (id: string) => Promise<boolean>;
    findById: (id: string) => Promise<Size | null>;
    findByIdAdmin: (id: string) => Promise<Size | null>;
    findByName: (name: string) => Promise<Size[] | null>;
    findByNameAdmin: (name: string) => Promise<Size[] | null>;
    findAllActive: () => Promise<Size[]>;
    findAllInactive: () => Promise<Size[]>;
    findAll: () => Promise<Size[]>;
}
export interface ISizeService {
    create: (name: ICreateSizeForm) => Promise<Size>;
    update: (id: string, form : IUpdateSizeForm) => Promise<Size | null>;
    delete: (id: string) => Promise<boolean>;
    restore: (id: string) => Promise<boolean>;
    getById: (id: string) => Promise<Size | null>;
    getByIdAdmin: (id: string) => Promise<Size | null>;
    getByName: (name: string) => Promise<Size[] | null>;
    getByNameAdmin: (name: string) => Promise<Size[] | null>;
    getAllActive: () => Promise<Size[]>;
    getAllInactive: () => Promise<Size[]>;
    getAll: () => Promise<Size[]>;
}