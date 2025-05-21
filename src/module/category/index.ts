import { ServiceContext } from "../../shared/interface";
import { HttpCateController } from "./controller";
import { CateService } from "./service";
import { MongodbCateRepository } from "./service/mongodb";


export function setupCateModule(sctx: ServiceContext) {
    const repository = new MongodbCateRepository();

    const service = new CateService(repository);

    const controller = new HttpCateController(service);

    return controller.getRoutes(sctx.mdlFactory);
}