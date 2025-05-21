import { ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { ICartItemRepository, ICartItemService } from "../interface";
import { CartItem, cartItemSchema, CreateCartItem, createCartItemSchema, UpdateCartItem, UpdateCartItemForm } from "../model";

export class CartItemService implements ICartItemService {
    constructor(private readonly cartItemRepository: ICartItemRepository) { }

    async create(form: CreateCartItem): Promise<CartItem> {
        const existingCartItem = await mongodbService.cartitem.findOne({
            cartId: new ObjectId(form.cartId),
            productItemId: new ObjectId(form.productItemId),
        });
        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + form.quantity;
            const newTotalPriceCartItem = existingCartItem.price * newQuantity;
            const productInCartItem = await mongodbService.productitem.findOne({ _id: new Object(form.productItemId) });
            if (!productInCartItem) {
                throw new Error("Product item not found");
            }
            if (newQuantity > productInCartItem.quantity) {
                throw new Error("Quantity exceeds available stock");
            }
            await mongodbService.cartitem.updateOne(
                { _id: existingCartItem._id },
                {
                    $set: {
                        quantity: newQuantity,
                        totalPriceCartItem: newTotalPriceCartItem
                    }
                }
            );
            

            const updatedCartItem = await mongodbService.cartitem.findOne({ _id: existingCartItem._id });
            return updatedCartItem as CartItem;
        } else {
            const cartItemToInsert = {
                _id: new ObjectId(),
                cartId: form.cartId,
                productItemId: form.productItemId,
                nameProductItem: form.nameProductItem,
                price: form.price,
                quantity: form.quantity,
                imageProductItem: form.imageProductItem,
                totalPriceCartItem:
                    form.price * form.quantity,
            }

            const newCartItem = await this.cartItemRepository.insert(cartItemToInsert);
            return newCartItem as CartItem;
        }
    }
    async update(id: string, form: UpdateCartItemForm): Promise<CartItem | null> {
        const find = await mongodbService.cartitem.findOne({ _id: new ObjectId(id) });
        if (!find) {
            return null;
        }
        const productItemInCartItem = await mongodbService.productitem.findOne
            ({
                _id: new Object(find.productItemId)
            });
        if (!productItemInCartItem) {
            throw new Error("Product item not found");
        }
        if(find.quantity > productItemInCartItem.quantity){
            throw new Error("Quantity exceeds available stock");
        }
        const result = await mongodbService.cartitem.updateOne(
            { _id: find._id },
            {
                $set:
                {
                    quantity: form.quantity,
                    totalPriceCartItem: find.price * form.quantity,
                }
            }
        );
        if (result.modifiedCount === 0) {
            throw new Error("Update failed");
        }
        const updatedCartItem = await mongodbService.cartitem.findOne({ _id: new ObjectId(id) });
        return updatedCartItem as CartItem;
    }
    async delete(id: string): Promise<boolean> {
        const result = await this.cartItemRepository.delete(id);
        return result;
    }
    async getAllCartItemByUserId(id: string): Promise<CartItem[] | null> {
        const result = await this.cartItemRepository.findAllCartItemByUserId(id);
        return result;
    }
    async getCartItemById(id: string): Promise<CartItem | null> {
        const result = await this.cartItemRepository.findCartItemById(id);
        return result;
    }
}