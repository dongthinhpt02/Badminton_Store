import { Cart, IUpdateCartForm } from "../model";

export interface ICartRepository {
    insert: (cart : Cart) => Promise<Cart>;
    findById: (id: string) => Promise<Cart | null>;
    findByUserId : (userId: string) => Promise<Cart | null>;
    update (id : string, form : IUpdateCartForm): Promise<Cart>;
    updateCartTotals(userId: string): Promise<Cart | null>
    calculateShippingFee(id: string, payload: {
        from_district_id: number,
        from_ward_code: string,
        to_district_id: number,
        to_ward_code: string,
      }): Promise<any>;
}

export interface ICartService {
    insertCart: (cart: Cart) => Promise<Cart>;
    getCartById: (id: string) => Promise<Cart | null>;
    getCartByUserId : (userId: string) => Promise<Cart | null>;
    updateCart: (id : string, form : IUpdateCartForm) => Promise<Cart>;
    updateCartTotals :(cartId: string) => Promise<Cart>
    calculateShippingFee: (id: string, payload: {
        from_district_id: number,
        from_ward_code: string,
        to_district_id: number,
        to_ward_code: string
      }) => Promise<any>;
}