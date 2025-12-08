import { ObjectId } from "mongodb";
import { createImportSchema, ICreateImportForm, Import } from "../model";
import { IImportRepository, IImportService } from "../interface";

export class ImportService implements IImportService {
  constructor(private readonly importRepository: IImportRepository) {}
  async create(form: ICreateImportForm): Promise<Import> {
    const fixedForm = {
      ...form,
      supplierId: new ObjectId(form.supplierId),
    };
    const newImport = createImportSchema.parse(fixedForm);

    const importToInsert: Import = {
      _id: new ObjectId(),
      supplierId: newImport.supplierId,
      title: newImport.title,
      description: newImport.description,
      importDate: new Date(),
    };
    const result = await this.importRepository.insert(importToInsert);
    return result;
  }

  async getById(id: string): Promise<Import | null> {
    const result = await this.importRepository.findById(id);
    return result;
  }
  async getAll(): Promise<Import[]> {
    const result = await this.importRepository.findAll();
    return result;
  }
  async getByTitle(title: string): Promise<Import[] | null> {
    const result = await this.importRepository.findByTitle(title);
    return result;
  }
  async getByTimeRange(start: string, end: string): Promise<Import[] | null> {
    const result = await this.importRepository.findByTimeRange(start, end);
    return result;
  }
}
