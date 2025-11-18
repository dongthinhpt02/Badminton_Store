import { ICreateSupplierForm, IUpdateSupplierForm, Supplier } from "../model";

export interface ISupplierRepository {
  insert: (name: Supplier) => Promise<Supplier>;
  update: (id: string, form: IUpdateSupplierForm) => Promise<Supplier | null>;
  delete: (id: string) => Promise<boolean>;
  restore: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<Supplier | null>;
  findByIdAdmin: (id: string) => Promise<Supplier | null>;
  findByName: (name: string) => Promise<Supplier[] | null>;
  findByNameAdmin: (name: string) => Promise<Supplier[] | null>;
  findAllActive: () => Promise<Supplier[]>;
  findAllInactive: () => Promise<Supplier[]>;
  findAll: () => Promise<Supplier[]>;
}
export interface ISupplierService {
  create: (name: ICreateSupplierForm) => Promise<Supplier>;
  update: (id: string, form: IUpdateSupplierForm) => Promise<Supplier | null>;
  delete: (id: string) => Promise<boolean>;
  restore: (id: string) => Promise<boolean>;
  getById: (id: string) => Promise<Supplier | null>;
  getByIdAdmin: (id: string) => Promise<Supplier | null>;
  getByName: (name: string) => Promise<Supplier[] | null>;
  getByNameAdmin: (name: string) => Promise<Supplier[] | null>;
  getAllActive: () => Promise<Supplier[]>;
  getAllInactive: () => Promise<Supplier[]>;
  getAll: () => Promise<Supplier[]>;
}
