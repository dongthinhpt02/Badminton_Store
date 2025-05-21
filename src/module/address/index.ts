import { ServiceContext } from "../../shared/interface";
import { HttpAddressController } from "./controller";
import { AddressService } from "./service";
import { MongodbAddressRepository } from "./service/mongodb";

export function setupAddressModule(sctx: ServiceContext) {
    const repository = new MongodbAddressRepository();

    const service = new AddressService(repository);

    const controller = new HttpAddressController(service);

    return controller.getRoutes(sctx.mdlFactory);
}