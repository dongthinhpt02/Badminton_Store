import { ICreateImportForm, Import } from "../model";

export interface IImportRepository {
  insert: (form: Import) => Promise<Import>;
  findById: (id: string) => Promise<Import | null>;
  findAll: () => Promise<Import[]>;
  findByTitle: (title: string) => Promise<Import[] | null>;
  findByTimeRange: (start: string, end: string) => Promise<Import[] | null>;
}

export interface IImportService {
  create: (form: ICreateImportForm) => Promise<Import>;
  getById: (id: string) => Promise<Import | null>;
  getAll: () => Promise<Import[]>;
  getByTitle: (title: string) => Promise<Import[] | null>;
  getByTimeRange: (start: string, end: string) => Promise<Import[] | null>;
}
