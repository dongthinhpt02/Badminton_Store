import Elysia, { Context } from "elysia";
import { MdlFactory } from "../../../shared/interface";
import { AuthContext } from "../../../shared/middleware";
import { successResponse } from "../../../shared/utils/response";
import { IAddressService } from "../interface";
import { createAddressSchema, ICreateAddress, updateAddressSchema } from "../model";
import { ObjectId } from "mongodb";

export class HttpAddressController {
    constructor(private readonly addressService: IAddressService) { }
    private async insertAddress(ctx: AuthContext) {
        const body = ctx.body as ICreateAddress;
        const userId = ctx.decoded.sub;
        const form = createAddressSchema.parse({
            ...body,
            _id: new ObjectId(),
            userId: new ObjectId(userId),
        });
        const data = await this.addressService.create(form);
        return successResponse(data, ctx);
    }
    private async updateAddress(ctx: AuthContext) {
        const id = ctx.params.id;
        const form = updateAddressSchema.parse(ctx.body);
        const data = await this.addressService.update(id, form);
        return successResponse(data, ctx);
    }
    private async getAllAddressByUserId(ctx: AuthContext) {
        const user_id = ctx.decoded.sub;
        const data = await this.addressService.getAllAddressByUserId(user_id);
        return successResponse(data, ctx);
    }
    getRoutes(mdlFactory: MdlFactory) {
        const addressRoutes = new Elysia({ prefix: "/address" })
            .derive(mdlFactory.auth)
            .post("/create", this.insertAddress.bind(this))
            .put("/update/:id", this.updateAddress.bind(this))
            .get("/search-by-user", this.getAllAddressByUserId.bind(this))
        return addressRoutes;
    }
}