// import { ServiceContext } from "../../shared/interface";
// import { HttpSupplierController } from "./controller";
// import { SupplierService } from "./service";
// import { MongodbSupplierRepository } from "./service/mongodb";

// export function setupSupplierModule(sctx: ServiceContext) {
//   const repository = new MongodbSupplierRepository();

//   const service = new SupplierService(repository);

//   const controller = new HttpSupplierController(service);

//   return controller.getRoutes(sctx.mdlFactory);
// }
