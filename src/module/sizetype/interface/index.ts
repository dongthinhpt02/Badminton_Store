import { ICreateSizeTypeForm, IUpdateSizeTypeForm, SizeType } from "../model";

export interface ISizeTypeRepository {
  insert: (name: SizeType) => Promise<SizeType>;
  update: (id: string, form: IUpdateSizeTypeForm) => Promise<SizeType | null>;
  delete: (id: string) => Promise<boolean>;
  restore: (id: string) => Promise<boolean>;
  findById: (id: string) => Promise<SizeType | null>;
  findByIdAdmin: (id: string) => Promise<SizeType | null>;
  findByName: (name: string) => Promise<SizeType[] | null>;
  findByNameAdmin: (name: string) => Promise<SizeType[] | null>;
  findAllActive: () => Promise<SizeType[]>;
  findAllInactive: () => Promise<SizeType[]>;
  findAll: () => Promise<SizeType[]>;
}
export interface ISizeTypeService {
  create: (name: ICreateSizeTypeForm) => Promise<SizeType>;
  update: (id: string, form: IUpdateSizeTypeForm) => Promise<SizeType | null>;
  delete: (id: string) => Promise<boolean>;
  restore: (id: string) => Promise<boolean>;
  getById: (id: string) => Promise<SizeType | null>;
  getByIdAdmin: (id: string) => Promise<SizeType | null>;
  getByName: (name: string) => Promise<SizeType[] | null>;
  getByNameAdmin: (name: string) => Promise<SizeType[] | null>;
  getAllActive: () => Promise<SizeType[]>;
  getAllInactive: () => Promise<SizeType[]>;
  getAll: () => Promise<SizeType[]>;
}
