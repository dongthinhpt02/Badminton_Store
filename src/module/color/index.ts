import { ServiceContext } from "../../shared/interface";
import { HttpColorController } from "./controller";
import { ColorService } from "./service";
import { MongodbColorRepository } from "./service/mongodb";

export function setupColorModule(sctx: ServiceContext) {
    const repository = new MongodbColorRepository();

    const service = new ColorService(repository);

    const controller = new HttpColorController(service);
    
    return controller.getRoutes(sctx.mdlFactory);
}