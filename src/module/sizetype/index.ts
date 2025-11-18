import { ServiceContext } from "../../shared/interface";
import { HttpSizeTypeController } from "./controller";
import { SizeTypeService } from "./service";
import { MongodbSizeTypeRepository } from "./service/mongodb";

export function setupSizeTypeModule(sctx: ServiceContext) {
  const repository = new MongodbSizeTypeRepository();

  const service = new SizeTypeService(repository);

  const controller = new HttpSizeTypeController(service);

  return controller.getRoutes(sctx.mdlFactory);
}
