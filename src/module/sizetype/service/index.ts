import { ObjectId } from "mongodb";
import { ISizeTypeRepository, ISizeTypeService } from "../interface";
import {
  createSizeTypeSchema,
  ICreateSizeTypeForm,
  IUpdateSizeTypeForm,
  SizeType,
  Status,
} from "../model";

export class SizeTypeService implements ISizeTypeService {
  constructor(private readonly sizetypeRepository: ISizeTypeRepository) {}
  async create(form: ICreateSizeTypeForm): Promise<SizeType> {
    const newSizeType = createSizeTypeSchema.parse(form);
    const sizeTypeToInsert: SizeType = {
      _id: new ObjectId(),
      nameSizeType: newSizeType.nameSizeType,
      description: newSizeType.description,
      created_at: new Date(),
      status: Status.ACTIVE,
      updated_at: null,
      deleted_at: null,
      restored_at: null,
    };
    const result = await this.sizetypeRepository.insert(sizeTypeToInsert);
    return result;
  }
  async update(
    id: string,
    form: IUpdateSizeTypeForm
  ): Promise<SizeType | null> {
    const result = await this.sizetypeRepository.update(id, form);
    return result;
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.sizetypeRepository.delete(id);
    return result;
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.sizetypeRepository.restore(id);
    return result;
  }
  async getById(id: string): Promise<SizeType | null> {
    const result = await this.sizetypeRepository.findById(id);
    return result;
  }
  async getByIdAdmin(id: string): Promise<SizeType | null> {
    const result = await this.sizetypeRepository.findByIdAdmin(id);
    return result;
  }
  async getByName(name: string): Promise<SizeType[] | null> {
    const result = await this.sizetypeRepository.findByName(name);
    return result;
  }
  async getByNameAdmin(name: string): Promise<SizeType[] | null> {
    const result = await this.sizetypeRepository.findByNameAdmin(name);
    return result;
  }
  async getAllActive(): Promise<SizeType[]> {
    const result = await this.sizetypeRepository.findAllActive();
    return result;
  }
  async getAllInactive(): Promise<SizeType[]> {
    const result = await this.sizetypeRepository.findAllInactive();
    return result;
  }
  async getAll(): Promise<SizeType[]> {
    const result = await this.sizetypeRepository.findAll();
    return result;
  }
}
