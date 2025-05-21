import { MongodbUserRepository } from "./service/mongodb";
import { HttpUserController } from "./controller";
import { ServiceContext } from "../../shared/interface";
import { UserService } from "./service";
import { ImagekitService } from "../imagekit/service";

export function setupUserModule(sctx: ServiceContext) {
  const repository = new MongodbUserRepository();

  const serviceImageKit = new ImagekitService();

  const service = new UserService(repository, serviceImageKit);

  const controller = new HttpUserController(service);

  return controller.getRoutes(sctx.mdlFactory);
}
