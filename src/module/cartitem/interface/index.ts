import { CartItem, CreateCartItem, UpdateCartItem, UpdateCartItemForm } from "../model";

export interface ICartItemRepository {
    insert: (cartitem: CartItem) => Promise<CartItem>;
    update: (id: string, form: UpdateCartItemForm) => Promise<CartItem | null>;
    delete: (id: string) => Promise<boolean>;
    findAllCartItemByUserId : (id : string) => Promise<CartItem[] | null>;
    findCartItemById : (id : string) => Promise<CartItem | null>;
}
export interface ICartItemService {
    create: (cartitem: CreateCartItem) => Promise<CartItem>;
    update: (id: string, form: UpdateCartItemForm) => Promise<CartItem | null>;
    delete: (id: string) => Promise<boolean>;
    getAllCartItemByUserId : (id : string) => Promise<CartItem[] | null>;
    getCartItemById : (id : string) => Promise<CartItem | null>;
}