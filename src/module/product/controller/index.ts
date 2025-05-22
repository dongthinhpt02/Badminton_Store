import Elysia, { Context } from "elysia";
import { IProductService } from "../interface";
import { MdlFactory } from "../../../shared/interface";
import { successResponse } from "../../../shared/utils/response";

export class HttpProductController {
    constructor(private readonly productService: IProductService) {}

    private async getById(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.productService.getById(id);

        return successResponse(data, ctx);
    }
    private async getByName(ctx: Context) {
        const nameProduct = ctx.query.nameProduct;
        const data = await this.productService.getByName(nameProduct);

        return successResponse(data, ctx);
    }
    private async getAllProductActive(ctx: Context) {
        const data = await this.productService.getAllProductActive();
        return successResponse(data, ctx);
    }

    getRoutes(mdlFactory: MdlFactory) {
        const productRoute = new Elysia({ prefix: "/product" })
            // .derive(mdlFactory.auth)
            .get("", this.getAllProductActive.bind(this))
            .get("/id", this.getById.bind(this))
            .get("/name", this.getByName.bind(this));
        return productRoute;
    }
}