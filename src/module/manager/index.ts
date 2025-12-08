import { ServiceContext } from "../../shared/interface";
import { BrandService } from "../brand/service";
import { MongodbBrandRepository } from "../brand/service/mongodb";
import { CateService } from "../category/service";
import { MongodbCateRepository } from "../category/service/mongodb";
import { ColorService } from "../color/service";
import { MongodbColorRepository } from "../color/service/mongodb";
import { ImagekitService } from "../imagekit/service";
import { ImportService } from "../import/service";
import { MongodbImportRepository } from "../import/service/mongodb";
import { ImportDetailService } from "../importdetail/service";
import { MongodbImportDetailRepository } from "../importdetail/service/mongodb";
import { OrderService } from "../order/service";
import { MongodbOrderRepository } from "../order/service/mongodb";
import { ProductService } from "../product/service";
import { MongodbProductRepository } from "../product/service/mongodb";
import { ProductItemService } from "../productitem/service";
import { MongodbProductItemRepository } from "../productitem/service/mongodb";
import { SizeService } from "../size/service";
import { MongodbSizeRepository } from "../size/service/mongodb";
import { SizeTypeService } from "../sizetype/service";
import { MongodbSizeTypeRepository } from "../sizetype/service/mongodb";
import { SupplierService } from "../supplier/service";
import { MongodbSupplierRepository } from "../supplier/service/mongodb";
import { UserService } from "../user/service";
import { MongodbUserRepository } from "../user/service/mongodb";
import { HttpManagerController } from "./controller";

export function setupManagerModule(sctx: ServiceContext) {
  const userRepository = new MongodbUserRepository();
  const brandRepository = new MongodbBrandRepository();
  const cateRepository = new MongodbCateRepository();
  const sizeRepository = new MongodbSizeRepository();
  const sizeTypeRepository = new MongodbSizeTypeRepository();
  const colorRepository = new MongodbColorRepository();
  const productRepository = new MongodbProductRepository();
  const productItemRepository = new MongodbProductItemRepository();
  const orderRepository = new MongodbOrderRepository();
  const supplierRepository = new MongodbSupplierRepository();
  const importRepository = new MongodbImportRepository();
  const importDetailRepository = new MongodbImportDetailRepository();

  const imagekitService = new ImagekitService();
  const userService = new UserService(userRepository, imagekitService);
  const brandService = new BrandService(brandRepository);
  const cateService = new CateService(cateRepository);
  const sizeService = new SizeService(sizeRepository);
  const sizeTypeService = new SizeTypeService(sizeTypeRepository);
  const colorService = new ColorService(colorRepository);
  const productService = new ProductService(productRepository);
  const productItemService = new ProductItemService(productItemRepository);
  const orderService = new OrderService(orderRepository);
  const supplierService = new SupplierService(supplierRepository);
  const importService = new ImportService(importRepository);
  const importDetailService = new ImportDetailService(
    importDetailRepository,
    productItemRepository
  );

  const controller = new HttpManagerController(
    userService,
    brandService,
    cateService,
    sizeService,
    sizeTypeService,
    colorService,
    productService,
    productItemService,
    orderService,
    supplierService,
    importService,
    importDetailService
  );

  return controller.getRoutes(sctx.mdlFactory);
}

//   private readonly userService: IUserService,
//         private readonly brandService: IBrandService,
//         private readonly cateService: ICateService,
//         private readonly sizeService: ISizeService,
//         private readonly colorService: IColorService,
//         private readonly productService: IProductService,
//         private readonly productItemService: IProductItemService,
//         private readonly orderService: IOrderService
//     ) { }
