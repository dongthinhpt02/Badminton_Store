import Elysia, { Context } from "elysia";
import { IPaymentService } from "../interface";
import { successResponse } from "../../../shared/utils/response";
import { MdlFactory } from "../../../shared/interface";

export class HttpPaymentController {
    constructor(private readonly paymentService: IPaymentService) { }
    private async getById(ctx: Context) {
        const id = ctx.params.id;
        const data = await this.paymentService.getById(id);
        return successResponse(data, ctx);
    }
    private async getByName(ctx: Context) {
        const name = ctx.params.namePayment;
        const data = await this.paymentService.getByName(name);
        return successResponse(data, ctx);
    }
    private async getAllActive(ctx: Context) {
        const data = await this.paymentService.getAllPaymentActive();
        return successResponse(data, ctx);
    }
    getRoutes(mdlFactory: MdlFactory) {
        const productRoute = new Elysia({ prefix: "/payment" })
            .derive(mdlFactory.auth)
            .get("", this.getAllActive.bind(this))
            .get("/:id", this.getById.bind(this))
            .get("/name/:namePayment", this.getByName.bind(this));
        return productRoute;
    }
}