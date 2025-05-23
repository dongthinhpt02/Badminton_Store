import Elysia, { Context } from "elysia";
import { IProductItemService } from "../interface";
import { AuthContext } from "../../../shared/middleware";
import { MdlFactory } from "../../../shared/interface";
import { successResponse } from "../../../shared/utils/response";

export class HttpProductItemController {
    constructor(private readonly productItemService: IProductItemService) { }
    private async getById(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.productItemService.getById(id);

        return successResponse(data, ctx);
    }
    private async getByName(ctx: Context) {
        const nameProductItem = ctx.params.nameProductItem;
        const data = await this.productItemService.getByName(nameProductItem);

        return successResponse(data, ctx);
    }
    private async getAllProductItemActive(ctx: Context) {
        const data = await this.productItemService.getAllProductItemActive();
        return successResponse(data, ctx);
    }
    private async getAllProductItemByBrandId(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.productItemService.getAllProductItemByBrandId(id);
        return successResponse(data, ctx);
    }
    private async getAllProductItemByCateId(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.productItemService.getAllProductItemByCateId(id);
        return successResponse(data, ctx);
    }
    private async getAllProductItemByProductId(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.productItemService.getAllProductItemByProductId(id);
        return successResponse(data, ctx);
    }
    private async getAllProductItemBySizeId(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.productItemService.getAllProductItemBySizeId(id);
        return successResponse(data, ctx);
    }
    private async getAllProductItemByColorId(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.productItemService.getAllProductItemByColorId(id);
        return successResponse(data, ctx);
    }
    getRoutes(mdlFactory: MdlFactory) {
        const productItemRoute = new Elysia({ prefix: "/productitem" })
            .derive(mdlFactory.auth)
            .get("", this.getAllProductItemActive.bind(this))
            .get("/:id", this.getById.bind(this))
            .get("/name/:nameProductItem", this.getByName.bind(this))
            .get("/brand/:id", this.getAllProductItemByBrandId.bind(this))
            .get("/cate/:id", this.getAllProductItemByCateId.bind(this))
            .get("/product/:id", this.getAllProductItemByProductId.bind(this))
            .get("/size/:id", this.getAllProductItemBySizeId.bind(this))
            .get("/color/:id", this.getAllProductItemByColorId.bind(this));
        return productItemRoute;
    }
}