import { ServiceContext } from "../../shared/interface";
import { HttpPaymentController } from "./controller";
import { PaymentService } from "./service";
import { MongodbPaymentRepository } from "./service/mongodb";

export function setupPaymentModule(sctx: ServiceContext) {
    const repository = new MongodbPaymentRepository();

    const service = new PaymentService(repository);

    const controller = new HttpPaymentController(service);
    
    return controller.getRoutes(sctx.mdlFactory);
}