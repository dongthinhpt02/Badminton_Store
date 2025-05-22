import Elysia, { Context } from "elysia";
import { successResponse } from "../../../shared/utils/response";
import { IColorService } from "../interface";
import { MdlFactory } from "../../../shared/interface";

export class HttpColorController {
    constructor(private readonly colorService: IColorService) {}
    private async getById(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.colorService.getById(id);
        return successResponse(data, ctx);
    }
    private async getByName(ctx: Context) {
        const nameColor = ctx.query.nameColor;
        const data = await this.colorService.getByName(nameColor);
        return successResponse(data, ctx);
    }
    private async getAllColorActive(ctx: Context) {
        const data = await this.colorService.getAllColorActive();
        return successResponse(data, ctx);
    }

    getRoutes(mdlFactory: MdlFactory) {
        const colorRoute = new Elysia({ prefix: "/color" })
            // .derive(mdlFactory.auth)
            .get("", this.getAllColorActive.bind(this))
            .get("/id", this.getById.bind(this))
            .get("/name", this.getByName.bind(this));
        return colorRoute;
    }
}