import { ICreateImportDetailForm, ImportDetail } from "../model";

export interface IImportDetailRepository {
  insert: (importDetail: ImportDetail) => Promise<ImportDetail>;
  findById: (id: string) => Promise<ImportDetail | null>;
  findAll: () => Promise<ImportDetail[]>;
  findByImportId: (importId: string) => Promise<ImportDetail[] | null>;
}
export interface IImportDetailService {
  create: (form: ICreateImportDetailForm) => Promise<ImportDetail>;
  getById: (id: string) => Promise<ImportDetail | null>;
  getAll: () => Promise<ImportDetail[]>;
  getByImportId: (importId: string) => Promise<ImportDetail[] | null>;
}
