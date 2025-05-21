import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { ICartItemRepository } from "../interface";
import { CartItem, CreateCartItem, UpdateCartItemForm } from "../model";
import { form } from "elysia";
import logger from "../../../shared/utils/logger";

export class MongodbCartItemRepository implements ICartItemRepository {
    async insert(cartitem: CartItem): Promise<CartItem> {
        const result = await mongodbService.cartitem.insertOne(cartitem);
        const found = await mongodbService.cartitem.findOne({ _id: result.insertedId });
        return found as CartItem;
    }
    async update(id: string, form: UpdateCartItemForm): Promise<CartItem | null> {
        // const find = await mongodbService.cartitem.findOne({ _id: new ObjectId(id) });
        // if (!find) {
        //     return null;
        // }
        // const productItemInCartItem = await mongodbService.productitem.findOne
        //     ({
        //         _id: new Object(find.productItemId)
        //     });
        // if (!productItemInCartItem) {
        //     throw new Error("Product item not found");
        // }
        // if(find.quantity > productItemInCartItem.quantity){
        //     throw new Error("Quantity exceeds available stock");
        // }
        // const result = await mongodbService.cartitem.updateOne(
        //     { _id: find._id },
        //     {
        //         $set:
        //         {
        //             quantity: form.quantity,
        //             totalPriceCartItem: find.price * form.quantity,
        //         }
        //     }
        // );
        // if (result.modifiedCount === 0) {
        //     throw new Error("Update failed");
        // }
        // const updatedCartItem = await mongodbService.cartitem.findOne({ _id: new ObjectId(id) });
        // return updatedCartItem as CartItem;
        const result = await mongodbService.cartitem.updateOne(
            { _id: new ObjectId(id) },
            { $set: form }
        );
        if (result.modifiedCount === 0) {
            throw new Error("Update failed");
        }
        const updatedCartItem = await mongodbService.cartitem.findOne({ _id: new ObjectId(id) });
        return updatedCartItem as CartItem;
    }
    async delete(id: string): Promise<boolean> {
        const find = await mongodbService.cartitem.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return false;
        }
        const result = mongodbService.cartitem.deleteOne({ _id: new ObjectId(id) });
        return true;
    }
    async findAllCartItemByUserId(id: string): Promise<CartItem[] | null> {
        const userObjectId = new ObjectId(id);
        const result = await mongodbService.users.aggregate([
            {
                $match: { _id: userObjectId }
            },
            {
                $lookup: {
                    from: "cart",
                    localField: "_id",
                    foreignField: "userId",
                    as: "cart"
                }
            },
            {
                $unwind: {
                    path: "$cart",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "cartitem",
                    localField: "cart._id",
                    foreignField: "cartId",
                    as: "cart.items"
                }
            }
        ]).toArray();

        console.log(JSON.stringify(result, null, 2)); // In ra dễ đọc

        const user = result[0]
        const resultTotal = user.cart.items;
        // // Step 1: Tìm Cart theo userId
        // const cart = await mongodbService.cart.findOne({ userId: userObjectId });
        // if (!cart) throw new Error("Cart not found");

        // // Step 2: Tìm CartItems theo cart._id
        // const cartItems = await mongodbService.cartitem
        //     .find({ cartId: cart._id })
        //     .toArray();

        return resultTotal as CartItem[];
    }
    async findCartItemById(id: string): Promise<CartItem | null> {
        const result = await mongodbService.cartitem.findOne({ _id: new ObjectId(id) });
        return result as CartItem;
    }
}