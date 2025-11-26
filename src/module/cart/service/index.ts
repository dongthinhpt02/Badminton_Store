import { ObjectId } from "mongodb";
import { ICartRepository, ICartService } from "../interface";
import { Cart, CartForm, IUpdateCartForm } from "../model";
import { MongodbCartRepository } from "./mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { CartItem } from "../../cartitem/model";

export class CartService implements ICartService {
  constructor(private readonly repository: ICartRepository) {}
  async insertCart(form: CartForm): Promise<CartForm> {
    const result = await this.repository.insert(form);
    return result;
  }
  async getCartById(id: string): Promise<CartForm | null> {
    const cart = await this.repository.findById(id);
    return cart;
  }

  async getCartByUserId(userId: string): Promise<CartForm | null> {
    const cart = await this.repository.findByUserId(userId);
    return cart;
  }
  async updateCart(id: string, form: IUpdateCartForm): Promise<Cart> {
    const result = await this.repository.update(id, form);
    return result;
  }
  async updateCartTotals(userId: string): Promise<Cart> {
    const result = await this.repository.updateCartTotals(userId);
    return result as Cart;
  }
  async UntickCartItem(cartItemId: string): Promise<CartItem> {
    const result = await this.repository.UntickCartItem(cartItemId);
    return result;
  }
  async TickCartItem(cartItemId: string): Promise<CartItem> {
    const result = await this.repository.TickCartItem(cartItemId);
    return result;
  }
  async calculateShippingFee(
    id: string,
    payload: {
      from_district_id: number;
      from_ward_code: string;
      to_district_id: number;
      to_ward_code: string;
    }
  ): Promise<any> {
    const result = await this.repository.calculateShippingFee(id, payload);
    return result;
  }
  async calculateTotalFee(
    id: string,
    payload: {
      from_district_id: number;
      from_ward_code: string;
      to_district_id: number;
      to_ward_code: string;
      address: string;
      phone: string;
      selectedItems: string[];
    }
  ): Promise<any> {
    const result = await this.repository.calculateTotalFee(id, payload);
    return result;
  }
  async VNPayPayment(
    id: string,
    payload: {
      amount: number;
    }
  ): Promise<any> {
    const result = await this.repository.VNPayPayment(id, payload);
    return result;
  }
}
