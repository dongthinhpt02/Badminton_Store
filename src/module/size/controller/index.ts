import Elysia, { Context } from "elysia";
import { MdlFactory } from "../../../shared/interface";
import { successResponse } from "../../../shared/utils/response";
import { ISizeService } from "../interface";

export class HttpSizeController {
    constructor(private sizeService: ISizeService) { }
    async getAllActive(ctx: Context) {
        const data = await this.sizeService.getAllActive();
        return successResponse(data, ctx);
    }
    async getById(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.sizeService.getById(id);
        return successResponse(data, ctx);
    }
    async getByName(ctx: Context) {
        const nameSize = ctx.params.nameSize;
        const data = await this.sizeService.getByName(nameSize);
        return successResponse(data, ctx);
    }
    getRoutes(mdlFactory : MdlFactory){
                const usersRoute = new Elysia({ prefix: "/size" })
                    .derive(mdlFactory.auth)
                    .get("", this.getAllActive.bind(this))
                    .get("/:id", this.getById.bind(this))
                    .get("/name/:nameSize", this.getByName.bind(this))
                    return usersRoute;
            }
}