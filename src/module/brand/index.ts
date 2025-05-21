import { ServiceContext } from "../../shared/interface";
import { HttpBrandController } from "./controller";
import { BrandService } from "./service";
import { MongodbBrandRepository } from "./service/mongodb";

export function setupBrandModule(sctx: ServiceContext) {
    const repository = new MongodbBrandRepository();

    const service = new BrandService(repository);

    const controller = new HttpBrandController(service);

    return controller.getRoutes(sctx.mdlFactory);
}