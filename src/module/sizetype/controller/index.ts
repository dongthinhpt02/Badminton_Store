import Elysia, { Context } from "elysia";
import { ISizeTypeService } from "../interface";
import { successResponse } from "../../../shared/utils/response";
import { MdlFactory } from "../../../shared/interface";

export class HttpSizeTypeController {
  constructor(private sizetypeService: ISizeTypeService) {}
  async getAllActive(ctx: Context) {
    const data = await this.sizetypeService.getAllActive();
    return successResponse(data, ctx);
  }
  async getById(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.sizetypeService.getById(id);
    return successResponse(data, ctx);
  }
  async getByName(ctx: Context) {
    const nameSizeType = ctx.query.nameSizeType;
    const data = await this.sizetypeService.getByName(nameSizeType);
    return successResponse(data, ctx);
  }
  getRoutes(mdlFactory: MdlFactory) {
    const sizetypeRoute = new Elysia({ prefix: "/sizetype" })
      // .derive(mdlFactory.auth)
      .get("", this.getAllActive.bind(this))
      .get("/id", this.getById.bind(this))
      .get("/name", this.getByName.bind(this));
    return sizetypeRoute;
  }
}
