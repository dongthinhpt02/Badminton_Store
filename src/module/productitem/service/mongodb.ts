import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IProductItemRepository } from "../interface";
import { IUpdateProductItemForm, ProductItem, Status } from "../model";
import { normalizeText } from "../../../shared/utils/normalize";
import { $ } from "bun";

export class MongodbProductItemRepository implements IProductItemRepository {
    async insert(productItem: ProductItem): Promise<ProductItem> {
        const result = await mongodbService.productitem.insertOne(productItem);
        const found = await mongodbService.productitem.findOne({ _id: result.insertedId });
        return found as ProductItem;
    }

    async update(id: string, form: IUpdateProductItemForm): Promise<ProductItem | null> {
        const result = await mongodbService.productitem.updateOne(
            { _id: new ObjectId(id) },
            { $set: form }
        );
        if (result.modifiedCount === 0) {
            throw new Error("Update failed");
        }
        const updatedProductItem = await mongodbService.productitem.findOne({ _id: new ObjectId(id) });
        return updatedProductItem;
    }

    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.productitem.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.productitem.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    restored_at: new Date(),
                    status: Status.INACTIVE,
                }
            }
        );
        return true;
    }

    async restore(id: string): Promise<boolean> {
        const find = await mongodbService.productitem.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.productitem.updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: {
                    deleted_at: new Date(),
                    status: Status.ACTIVE,
                }
            }
        );
        return true;
    }

    async findById(id: string): Promise<ProductItem | null> {
        const productItem = await mongodbService.productitem.findOne(
            {
                _id: new ObjectId(id),
                status: Status.ACTIVE,
            });
        return productItem;
    }

    async findByName(nameProductItem: string): Promise<ProductItem[] | null> {
        const normalized = normalizeText(nameProductItem);
        const result = await mongodbService.productitem.find({
            normalizedNameProductItem: { $regex: `.*${normalized}.*`, $options: "i" },
            status: Status.ACTIVE,
        }).toArray();
        return result.length > 0 ? result : null;
    }

    async findByIdAdmin(id: string): Promise<ProductItem | null> {
        const productItem = await mongodbService.productitem.findOne(
            {
                _id: new ObjectId(id),
            });
        return productItem;
    }

    async findByNameAdmin(nameProductItem: string): Promise<ProductItem[] | null> {
        const normalized = normalizeText(nameProductItem);
        const result = await mongodbService.productitem.find({
            normalizedNameProductItem: { $regex: `.*${normalized}.*`, $options: "i" },
        }).toArray();
        return result.length > 0 ? result : null;
    }
    async findAllProductItemActive(): Promise<ProductItem[]> {
        const productItems = await mongodbService.productitem.find({
            status: Status.ACTIVE,
        }).toArray();
        return productItems;
    }

    async findAllProductItemInactive(): Promise<any[]> {
        const productItems = await mongodbService.productitem.find({
            status: Status.INACTIVE,
        }).toArray();
        return productItems;
    }

    async findAllProductItem(): Promise<ProductItem[]> {
        const productItems = await mongodbService.productitem.find().toArray();
        return productItems;
    }

    async findAllProductItemByBrandId(brandId: string): Promise<ProductItem[] | null> {
        const find = await mongodbService.brand.findOne({ _id: new ObjectId(brandId) });
        if (!find || find.status === Status.INACTIVE) {
            return null;
        }
        // console.log(find);
        const result = await mongodbService.brand.aggregate([
            {
                $match: {
                    _id: new ObjectId(brandId),
                    status: Status.ACTIVE
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "_id",
                    foreignField: "brandId",
                    as: "product"
                }
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "productitem",
                    localField: "product._id",
                    foreignField: "productId",
                    as: "product.productItem"
                }
            },
            {
                $unwind: {
                    path: "$product.productItem",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "product.productItem.status": { $ne: Status.INACTIVE } // ✅ lọc productItem INACTIVE
                }
            }
        ]).toArray();
        const allItems = result
        .map((item) => item.product?.productItem)
        .filter((item): item is ProductItem => !!item);
        return allItems as ProductItem[];
    }
    async findAllProductItemByCateId(cateId: string): Promise<ProductItem[] | null> {
        const find = await mongodbService.cate.findOne({ _id: new ObjectId(cateId) });
        if (!find || find.status === Status.INACTIVE) {
            return null;
        }
        const result = await mongodbService.cate.aggregate([
            {
                $match: {
                    _id: new ObjectId(cateId),
                    status: Status.ACTIVE
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "_id",
                    foreignField: "cateId",
                    as: "product"
                }
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "productitem",
                    localField: "product._id",
                    foreignField: "productId",
                    as: "product.productItem"
                }
            },
            {
                $unwind: {
                    path: "$product.productItem",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "product.productItem.status": { $ne: Status.INACTIVE } // ✅ lọc productItem INACTIVE
                }
            }
        ]).toArray();
        const allItems = result
        .map((item) => item.product?.productItem)
        .filter((item): item is ProductItem => !!item);
        return allItems as ProductItem[];
    }
    async findAllProductItemByProductId(productId: string): Promise<ProductItem[] | null> {
        const find = await mongodbService.product.findOne({ _id: new ObjectId(productId) });
        if (!find || find.status === Status.INACTIVE) {
            return null;
        }
        const result = await mongodbService.product.aggregate([
            {
                $match: {
                    _id: new ObjectId(productId),
                    status: Status.ACTIVE
                }
            },
            {
                $lookup: {
                    from: "productitem",
                    localField: "_id",
                    foreignField: "productId",
                    as: "productItem"
                }
            },
            {
                $unwind: {
                    path: "$productItem",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "productItem.status": { $ne: Status.INACTIVE } // ✅ lọc productItem INACTIVE
                }
            }
        ]).toArray();
        const allItems = result
        .map((item) => item.productItem)
        .filter((item): item is ProductItem => !!item);
        return allItems as ProductItem[];
    }
    async findAllProductItemBySizeId(sizeId: string): Promise<ProductItem[] | null> {
        const find = await mongodbService.size.findOne({ _id: new ObjectId(sizeId) });
        if (!find || find.status === Status.INACTIVE) {
            return null;
        }
        const result = await mongodbService.size.aggregate([
            {
                $match: {
                    _id: new ObjectId(sizeId),
                    status: Status.ACTIVE
                }
            },
            {
                $lookup: {
                    from: "productitem",
                    localField: "_id",
                    foreignField: "sizeId",
                    as: "productItem"
                }
            },   
            {
                $unwind: {
                    path: "$productItem",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "productItem.status": { $ne: Status.INACTIVE } // ✅ lọc productItem INACTIVE
                }
            }
        ]).toArray();
        const allItems = result
        .map((item) => item.productItem)
        .filter((item): item is ProductItem => !!item);
        return allItems as ProductItem[];
    }
    async findAllProductItemByColorId(colorId: string): Promise<ProductItem[] | null> {
        const find = await mongodbService.color.findOne({ _id: new ObjectId(colorId) });
        if (!find || find.status === Status.INACTIVE) {
            return null;
        }
        const result = await mongodbService.color.aggregate([
            {
                $match: {
                    _id: new ObjectId(colorId),
                    status: Status.ACTIVE
                }
            },
            {
                $lookup: {
                    from: "productitem",
                    localField: "_id",
                    foreignField: "colorId",
                    as: "productItem"
                }
            },   
            {
                $unwind: {
                    path: "$productItem",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "productItem.status": { $ne: Status.INACTIVE } // ✅ lọc productItem INACTIVE
                }
            }
        ]).toArray();
        const allItems = result
        .map((item) => item.productItem)
        .filter((item): item is ProductItem => !!item);
        return allItems as ProductItem[];
    }
}