import { ICartItemService } from "../interface";

export class HttpCartItemController {
    constructor(private readonly cartItemService: ICartItemService) {}
    async create(data : any) {
        
    }
}