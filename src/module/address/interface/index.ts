import { Address, ICreateAddress } from "../model";

export interface IAddressRepository{
    insert (address: Address): Promise<Address>
    update (id: string, form: any): Promise<Address | null>
    findAllAddressByUserId (userId: string): Promise<Address[]>
    findAllAddress(): Promise<Address[]>
    findAddressById(id : string) : Promise<Address[]>
}
export interface IAddressService{
    create (form: ICreateAddress): Promise<Address>
    update (id: string, form: any): Promise<Address | null>
    getAllAddressByUserId (userId: string): Promise<Address[]>
    getAllAddress(): Promise<Address[]>
    getAddressById(id : string) : Promise<Address[]>
    syncGHNProvinces(): Promise<void>
    syncGHNDistricts(): Promise<void>
    syncGHNWards(): Promise<void>
}