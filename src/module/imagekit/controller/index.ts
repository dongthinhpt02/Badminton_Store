import Elysia from "elysia";
import { IImageKitService } from "../interface";
import { MdlFactory } from "../../../shared/interface";

export class HttpImageKitController {
    constructor(private readonly imagekitService: IImageKitService) {}
    
    async uploadPicture (ctx: any) {
        const { file } = ctx.body;
        const result = await this.imagekitService.generateImageToken(file);
        return result;
    }
    
    getRoutes(mdlFactory: MdlFactory) {
        const imagekitRoute = new Elysia({ prefix: "/imagekit" })
            .derive(mdlFactory.auth)
            .post("/upload", this.uploadPicture.bind(this));
        return imagekitRoute;
    }
}