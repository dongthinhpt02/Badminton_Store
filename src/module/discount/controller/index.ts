import Elysia, { Context } from "elysia";
import { IDiscountService } from "../interface";
import { successResponse } from "../../../shared/utils/response";
import { MdlFactory } from "../../../shared/interface";

export class HttpDiscountController {
    constructor(private readonly discountService: IDiscountService) { }
    private async getById(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.discountService.getById(id);
        return successResponse(data, ctx);
    }
    private async getByCode(ctx: Context) {
        const code = ctx.params.code;
        const data = await this.discountService.getByCode(code);
        return successResponse(data, ctx);
    }
    private async getAllDiscountActive(ctx: Context) {
        const data = await this.discountService.getAllDiscountActive();
        return successResponse(data, ctx);
    }
    getRoutes(mdlFactory: MdlFactory) {
        const productRoute = new Elysia({ prefix: "/discount" })
            .derive(mdlFactory.auth)
            .get("", this.getAllDiscountActive.bind(this))
            .get("/:id", this.getById.bind(this))
            .get("/code/:code", this.getByCode.bind(this));
        return productRoute;
    }
}