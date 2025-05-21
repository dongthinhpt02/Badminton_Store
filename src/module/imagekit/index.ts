import { ServiceContext } from "../../shared/interface";
import { HttpImageKitController } from "./controller";
import { ImagekitService } from "./service";


export function setupImagekitModule(sctx: ServiceContext) {

  const service = new ImagekitService();

  const controller = new HttpImageKitController(service);

  return controller.getRoutes(sctx.mdlFactory);
}
