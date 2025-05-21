import { ServiceContext } from "../../shared/interface";
import { HttpDiscountController } from "./controller";
import { DiscountService } from "./service";
import { MongodbDiscountRepository } from "./service/mongodb";

export function setupDiscountModule(sctx: ServiceContext) {
    const repository = new MongodbDiscountRepository();

    const service = new DiscountService(repository);

    const controller = new HttpDiscountController(service);
    
    return controller.getRoutes(sctx.mdlFactory);
}