import { Cate, CateForm, ICreateCateForm, IUpdateCateForm } from "../model";

export interface ICateRepository {
    insert: (cate: Cate) => Promise<Cate>;
    update: (id: string, form: IUpdateCateForm) => Promise<Cate | null>;
    delete : (id: string) => Promise<boolean>;
    restore : (id: string) => Promise<boolean>;
    findById: (id: string) => Promise<Cate | null>;
    findByIdAdmin: (id: string) => Promise<Cate | null>;
    findByName : (cateName: string) => Promise<Cate[] | null>;
    findByNameAdmin : (cateName: string) => Promise<Cate[] | null>;
    findAllCateActive : () => Promise<Cate[]>;
    findAllCateInactive : () => Promise<Cate[]>;
    findAllCate () : Promise<Cate[]>;
}

export interface ICateService {
    create: (form: ICreateCateForm) => Promise<Cate>;
    update: (id: string, form: IUpdateCateForm) => Promise<Cate | null>;
    delete : (id: string) => Promise<boolean>;
    restore : (id: string) => Promise<boolean>;
    getById: (id: string) => Promise<Cate | null>;
    getByIdAdmin: (id: string) => Promise<Cate | null>;
    getByName : (cateName: string) => Promise<Cate[] | null>;
    getByNameAdmin : (cateName: string) => Promise<Cate[] | null>;
    getAllCateActive : () => Promise<Cate[]>;
    getAllCateInactive : () => Promise<Cate[]>;
    getAllCate : () => Promise<Cate[]>;
}