import Elysia, { Context } from "elysia";
import { successResponse } from "../../../shared/utils/response";
import { IBrandService } from "../interface";
import { brandSchema } from "../model";
import { MdlFactory } from "../../../shared/interface";

export class HttpBrandController {
    constructor (
        private readonly brandService: IBrandService
    ) {}
    private async getById(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.brandService.getById(id);

        return successResponse(data, ctx);
    }
    private async getByName(ctx: Context) {
        const brandName = ctx.params.brandName;
        const data = await this.brandService.getByName(brandName);

        return successResponse(data, ctx);
    }
    private async getAllBrandActive(ctx: Context) {
        const data = await this.brandService.getAllBrandActive();

        return successResponse(data, ctx);
    }

    getRoutes(mdlFactory : MdlFactory){
        const usersRoute = new Elysia({ prefix: "/brand" })
            .derive(mdlFactory.auth)
            .get("", this.getAllBrandActive.bind(this))
            .get("/:id", this.getById.bind(this))
            .get("/name/:brandName", this.getByName.bind(this))
            return usersRoute;
    }
}