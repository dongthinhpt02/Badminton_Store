import { form } from "elysia";
import { IImportDetailRepository, IImportDetailService } from "../interface";
import {
  createImportDetailSchema,
  ICreateImportDetailForm,
  ImportDetail,
} from "../model";
import { ObjectId } from "mongodb";
import { Product } from "../../product/model";
import { ProductItem } from "../../productitem/model";
import { MongodbProductItemRepository } from "../../productitem/service/mongodb";

export class ImportDetailService implements IImportDetailService {
  constructor(
    private readonly importDetailRepository: IImportDetailRepository,
    private readonly productItemRepository: MongodbProductItemRepository
  ) {}
  async create(form: ICreateImportDetailForm): Promise<ImportDetail> {
    const fixedForm = {
      ...form,
      importId: new ObjectId(form.importId),
      productItemId: new ObjectId(form.productItemId),
      colorId: new ObjectId(form.colorId),
      sizeId: new ObjectId(form.sizeId),
    };
    const newImportDetail = createImportDetailSchema.parse(fixedForm);

    const importDetailToInsert: ImportDetail = {
      _id: new ObjectId(),
      importId: newImportDetail.importId,
      productItemId: newImportDetail.productItemId,
      colorId: newImportDetail.colorId,
      sizeId: newImportDetail.sizeId,
      productItemName: newImportDetail.productItemName,
      imgProductItem: newImportDetail.imgProductItem,
      quantity: newImportDetail.quantity,
    };

    const result = await this.importDetailRepository.insert(
      importDetailToInsert
    );
    const productItem = await this.productItemRepository.updateQuantity(
      newImportDetail.productItemId.toHexString(),
      newImportDetail.quantity
    );
    return result as ImportDetail;
  }
  async getById(id: string): Promise<ImportDetail | null> {
    const result = await this.importDetailRepository.findById(id);
    return result;
  }
  async getAll(): Promise<ImportDetail[]> {
    const result = await this.importDetailRepository.findAll();
    return result;
  }
  async getByImportId(importId: string): Promise<ImportDetail[] | null> {
    const result = await this.importDetailRepository.findByImportId(importId);
    return result;
  }
}
