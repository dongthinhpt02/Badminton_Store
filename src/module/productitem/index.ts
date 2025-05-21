import { ServiceContext } from "../../shared/interface";
import { HttpProductItemController } from "./controller";
import { ProductItemService } from "./service";
import { MongodbProductItemRepository } from "./service/mongodb";


export function setupProductItemModule(sctx: ServiceContext) {
  const repository = new MongodbProductItemRepository();

  const service = new ProductItemService(repository);

  const controller = new HttpProductItemController(service);

  return controller.getRoutes(sctx.mdlFactory);
}