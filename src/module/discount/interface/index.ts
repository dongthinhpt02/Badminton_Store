import { Discount, ICreateDiscount, IUpdateDiscount } from "../model";

export interface IDiscountRepository {
    insert (discount : Discount): Promise<Discount>
    update (id : string, form : IUpdateDiscount): Promise<Discount | null>
    delete (id : string): Promise<boolean>
    restore (id : string): Promise<boolean>
    findById (id : string): Promise<Discount | null>
    findByIdAdmin (id : string): Promise<Discount | null>
    findByCode(code: string): Promise<Discount | null>
    findByCodeAdmin(code: string): Promise<Discount | null>
    findAllDiscountActive (): Promise<Discount[]>
    findAllDiscountInactive (): Promise<Discount[]>
    findAllDiscount (): Promise<Discount[]>
}
export interface IDiscountService {
    create (discount : ICreateDiscount): Promise<Discount>
    update (id : string, form : IUpdateDiscount): Promise<Discount | null>
    delete (id : string): Promise<boolean>
    restore (id : string): Promise<boolean>
    getById (id : string): Promise<Discount | null>
    getByIdAdmin (id : string): Promise<Discount | null>
    getByCode(code: string): Promise<Discount | null>
    getByCodeAdmin(code: string): Promise<Discount | null>
    getAllDiscountActive (): Promise<Discount[]>
    getAllDiscountInactive (): Promise<Discount[]>
    getAllDiscount (): Promise<Discount[]>
}