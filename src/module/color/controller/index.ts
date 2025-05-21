import Elysia, { Context } from "elysia";
import { successResponse } from "../../../shared/utils/response";
import { IColorService } from "../interface";
import { MdlFactory } from "../../../shared/interface";

export class HttpColorController {
    constructor(private readonly colorService: IColorService) {}
    private async getById(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.colorService.getById(id);
        return successResponse(data, ctx);
    }
    private async getByName(ctx: Context) {
        const colorName = ctx.params.colorName;
        const data = await this.colorService.getByName(colorName);
        return successResponse(data, ctx);
    }
    private async getAllColorActive(ctx: Context) {
        const data = await this.colorService.getAllColorActive();
        return successResponse(data, ctx);
    }

    getRoutes(mdlFactory: MdlFactory) {
        const colorRoute = new Elysia({ prefix: "/color" })
            .derive(mdlFactory.auth)
            .get("/color", this.getAllColorActive.bind(this))
            .get("/color/:id", this.getById.bind(this))
            .get("/color/name/:colorName", this.getByName.bind(this));
        return colorRoute;
    }
}