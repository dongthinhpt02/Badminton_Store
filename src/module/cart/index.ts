import { ServiceContext } from "../../shared/interface";
import { CartItemService } from "../cartitem/service";
import { MongodbCartItemRepository } from "../cartitem/service/mongodb";
import { HttpCartController } from "./controller";
import { CartService } from "./service";
import { MongodbCartRepository } from "./service/mongodb";

export function setupCartModule(sctx: ServiceContext) {
  const repository = new MongodbCartRepository();
  const itemCartRepository = new MongodbCartItemRepository();

  const service = new CartService(repository);
  const cartItemService = new CartItemService(itemCartRepository);

  const controller = new HttpCartController(service, cartItemService);

  return controller.getRoutes(sctx.mdlFactory);
}