import { ServiceContext } from "../../shared/interface";
import { HttpProductController } from "./controller";
import { ProductService } from "./service";
import { MongodbProductRepository } from "./service/mongodb";

export function setupProductModule(sctx: ServiceContext) {
    const repository = new MongodbProductRepository();

    const service = new ProductService(repository);

    const controller = new HttpProductController(service);
    
    return controller.getRoutes(sctx.mdlFactory);
}