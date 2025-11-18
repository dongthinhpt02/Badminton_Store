import { ObjectId } from "mongodb";
import { ISupplierRepository, ISupplierService } from "../interface";
import {
  createSupplierSchema,
  ICreateSupplierForm,
  Status,
  Supplier,
} from "../model";

export class SupplierService implements ISupplierService {
  constructor(private readonly supplierRepository: ISupplierRepository) {}
  async create(form: ICreateSupplierForm): Promise<Supplier> {
    const newSupplier = createSupplierSchema.parse(form);
    const supplierToInsert: Supplier = {
      _id: new ObjectId(),
      nameSupplier: newSupplier.nameSupplier,
      address: newSupplier.address,
      created_at: new Date(),
      status: Status.ACTIVE,
      updated_at: null,
      deleted_at: null,
      restored_at: null,
    };
    const result = await this.supplierRepository.insert(supplierToInsert);
    return result;
  }
  async update(
    id: string,
    form: Partial<ICreateSupplierForm>
  ): Promise<Supplier | null> {
    const result = await this.supplierRepository.update(id, form);
    return result;
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.supplierRepository.delete(id);
    return result;
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.supplierRepository.restore(id);
    return result;
  }
  async getById(id: string): Promise<Supplier | null> {
    const result = await this.supplierRepository.findById(id);
    return result;
  }
  async getByIdAdmin(id: string): Promise<Supplier | null> {
    const result = await this.supplierRepository.findByIdAdmin(id);
    return result;
  }
  async getByName(name: string): Promise<Supplier[] | null> {
    const result = await this.supplierRepository.findByName(name);
    return result;
  }
  async getByNameAdmin(name: string): Promise<Supplier[] | null> {
    const result = await this.supplierRepository.findByNameAdmin(name);
    return result;
  }
  async getAllActive(): Promise<Supplier[]> {
    const result = await this.supplierRepository.findAllActive();
    return result;
  }
  async getAllInactive(): Promise<Supplier[]> {
    const result = await this.supplierRepository.findAllInactive();
    return result;
  }
  async getAll(): Promise<Supplier[]> {
    const result = await this.supplierRepository.findAll();
    return result;
  }
}
