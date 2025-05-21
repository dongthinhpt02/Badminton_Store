import { IPaymentCreateForm, IUpdatePayment, Payment } from "../model"

export interface IPaymentRepository{
    insert(payment : Payment): Promise<Payment>
    update(id : string, form : IUpdatePayment): Promise<Payment | null>
    delete(id : string): Promise<boolean>
    restore(id : string): Promise<boolean>
    findById(id : string): Promise<Payment | null>
    findByIdAdmin(id : string): Promise<Payment | null>
    findByName(name : string): Promise<Payment | null>
    findByNameAdmin (name : string): Promise<Payment | null>
    findAllPaymentActive(): Promise<Payment[]>
    findAllPaymentInactive(): Promise<Payment[]>
    findAllPayment(): Promise<Payment[]>
}
export interface IPaymentService{
    create(form : IPaymentCreateForm): Promise<Payment>
    update(id : string, form : IUpdatePayment): Promise<Payment | null>
    delete(id : string): Promise<boolean>
    restore(id : string): Promise<boolean>
    getById(id : string): Promise<Payment | null>
    getByIdAdmin(id : string): Promise<Payment | null>
    getByName(name : string): Promise<Payment | null>
    getByNameAdmin(name : string): Promise<Payment | null>
    getAllPaymentActive(): Promise<Payment[]>
    getAllPaymentInactive(): Promise<Payment[]>
    getAllPayment(): Promise<Payment[]>
}