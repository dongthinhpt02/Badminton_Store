import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IProductRepository } from "../interface";
import { ICreateProductForm, IUpdateProductForm, Product, ProductForm, Status } from "../model";

export class MongodbProductRepository implements IProductRepository {
    async insert(product: Product): Promise<Product> {
        const result = await mongodbService.product.insertOne(product);
        const found = await mongodbService.product.findOne({ _id: result.insertedId });
        return found as Product;
    }
    async update(id: string, form: IUpdateProductForm): Promise<Product | null> {
        const result = await mongodbService.product.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    ...form,
                    updated_at: new Date(),
                }
            }
        );
        if (result.modifiedCount === 0) {
            return null;
        }
        const updated = await mongodbService.product.findOne({ _id: new ObjectId(id) });
        return updated;
    }
    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.product.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.product.updateOne({
            _id: new ObjectId(id),
        }, {
            $set: {
                deleted_at: new Date(),
                status: Status.INACTIVE,
            },
        });
        return true;
    }
    async restore(id: string): Promise<boolean> {
        const find = await mongodbService.product.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.product.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    restored_at: new Date(),
                    status: Status.ACTIVE,
                }
            }
        );
        return true;
    }
    async findById(id: string): Promise<Product | null> {
        const result = await mongodbService.product.findOne({
            _id: new ObjectId(id),
            status: Status.ACTIVE,
        });
        return result;
    }
    async findByIdAdmin(id: string): Promise<Product | null> {
        const result = await mongodbService.product.findOne({ _id: new ObjectId(id) });
        return result;
    }
    async findByName(nameProduct: string): Promise<Product[] | null> {
        const result = await mongodbService.product.find({
            nameProduct : { $regex: nameProduct, $options: 'i' } ,
            status: Status.ACTIVE,
        }).toArray();
        return result;
    }
    async findByNameAdmin(nameProduct: string): Promise<Product[] | null> {
        const result = await mongodbService.product.find
        (
            {nameProduct : { $regex: nameProduct, $options: 'i' } 

            }).toArray();
        return result;
    }
    async findAllProductActive(): Promise<Product[]> {
        const result = await mongodbService.product.find({
            status: Status.ACTIVE,
        }).toArray();
        return result;
    }
    async findAllProductInactive(): Promise<Product[]> {
        const result = await mongodbService.product.find({
            status: Status.INACTIVE,
        }).toArray();
        return result;
    }
    async findAllProduct(): Promise<Product[]> {
        const result = await mongodbService.product.find({}).toArray();
        return result;
    }
}