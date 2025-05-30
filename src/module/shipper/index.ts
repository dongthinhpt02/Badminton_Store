import { ServiceContext } from "../../shared/interface";
import { ImagekitService } from "../imagekit/service";
import { UserService } from "../user/service";
import { MongodbUserRepository } from "../user/service/mongodb";
import { HttpShipperController } from "./controller";
import { ShipperService } from "./service";
import { MongodbShipperRepository } from "./service/mongodb";

export function setupShipperModule(sctx: ServiceContext) {
    const repository = new MongodbShipperRepository();
    const userRepository = new MongodbUserRepository();

    const imageKitService = new ImagekitService();

    const service = new ShipperService(repository);
    const userService = new UserService(userRepository, imageKitService);

    const controller = new HttpShipperController(service, userService);

    return controller.getRoutes(sctx.mdlFactory);
}