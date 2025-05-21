import { ObjectId } from "mongodb";
import { ICartRepository, ICartService } from "../interface";
import { Cart, CartForm, IUpdateCartForm } from "../model";
import { MongodbCartRepository } from "./mongodb";
import { mongodbService } from "../../../shared/common/mongodb";

export class CartService implements ICartService{
    constructor(private readonly repository: ICartRepository) {}
    async insertCart(form: CartForm): Promise<CartForm>{
        const result = await this.repository.insert(form);
        return result;
    }
    async getCartById(id: string) : Promise<CartForm | null>{
        const cart = await this.repository.findById(id);
        return cart;
    }

    async getCartByUserId(userId: string) : Promise<CartForm | null>{
        const cart = await this.repository.findByUserId(userId);
        return cart;
    }
    async updateCart(id : string, form : IUpdateCartForm): Promise<Cart> {
        const result = await this.repository.update(id, form);
        return result;
    }
    async updateCartTotals(userId: string): Promise<Cart> {
        const result = await this.repository.updateCartTotals(userId);
        return result as Cart;
    }
    async calculateShippingFee(id: string, payload: {
        from_district_id: number,
        from_ward_code: string,
        to_district_id: number,
        to_ward_code: string
      }): Promise<any> {
        const result = await this.repository.calculateShippingFee(id, payload);
        return result;
      }
}