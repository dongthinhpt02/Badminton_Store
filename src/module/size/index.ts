import { ServiceContext } from "../../shared/interface";
import { HttpSizeController } from "./controller";
import { SizeService } from "./service";
import { MongodbSizeRepository } from "./service/mongodb";

export function setupSizeModule(sctx: ServiceContext) {
    const repository = new MongodbSizeRepository();

    const service = new SizeService(repository);

    const controller = new HttpSizeController(service);

    return controller.getRoutes(sctx.mdlFactory);
}