import { ServiceContext } from "../../shared/interface";
import { AddressService } from "../address/service";
import { MongodbAddressRepository } from "../address/service/mongodb";
import { BrandService } from "../brand/service";
import { MongodbBrandRepository } from "../brand/service/mongodb";
import { CateService } from "../category/service";
import { MongodbCateRepository } from "../category/service/mongodb";
import { ColorService } from "../color/service";
import { MongodbColorRepository } from "../color/service/mongodb";
import { DiscountService } from "../discount/service";
import { MongodbDiscountRepository } from "../discount/service/mongodb";
import { ImagekitService } from "../imagekit/service";
import { ImportService } from "../import/service";
import { MongodbImportRepository } from "../import/service/mongodb";
import { ImportDetailService } from "../importdetail/service";
import { MongodbImportDetailRepository } from "../importdetail/service/mongodb";
import { OrderService } from "../order/service";
import { MongodbOrderRepository } from "../order/service/mongodb";
import { PaymentService } from "../payment/service";
import { MongodbPaymentRepository } from "../payment/service/mongodb";
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
import { HttpAdminController } from "./controller";
import { AdminService } from "./service";
import { MongodbAdminRepository } from "./service/mongodb";

export function setupAdminModule(sctx: ServiceContext) {
  const brandRepository = new MongodbBrandRepository();
  const cateRepository = new MongodbCateRepository();
  const sizeRepository = new MongodbSizeRepository();
  const sizeTypeRepository = new MongodbSizeTypeRepository();
  const colorRepository = new MongodbColorRepository();
  const productRepository = new MongodbProductRepository();
  const productItemRepository = new MongodbProductItemRepository();
  const addressRepository = new MongodbAddressRepository();
  const discountRepository = new MongodbDiscountRepository();
  const paymentRepository = new MongodbPaymentRepository();
  const orderRepository = new MongodbOrderRepository();
  const supplierRepository = new MongodbSupplierRepository();
  const importRepository = new MongodbImportRepository();
  const importDetailRepository = new MongodbImportDetailRepository();
  const userRepository = new MongodbUserRepository();
  const adminRepository = new MongodbAdminRepository();

  const brandService = new BrandService(brandRepository);
  const cateService = new CateService(cateRepository);
  const sizeService = new SizeService(sizeRepository);
  const sizeTypeService = new SizeTypeService(sizeTypeRepository);
  const colorService = new ColorService(colorRepository);
  const productService = new ProductService(productRepository);
  const productItemService = new ProductItemService(productItemRepository);
  const addressService = new AddressService(addressRepository);
  const discountService = new DiscountService(discountRepository);
  const paymentService = new PaymentService(paymentRepository);
  const orderService = new OrderService(orderRepository);
  const supplierService = new SupplierService(supplierRepository);
  const importService = new ImportService(importRepository);
  const importDetailService = new ImportDetailService(
    importDetailRepository,
    productItemRepository
  );
  const imageKitService = new ImagekitService();
  const userService = new UserService(userRepository, imageKitService);
  const adminService = new AdminService(adminRepository);

  const controller = new HttpAdminController(
    brandService,
    cateService,
    sizeService,
    sizeTypeService,
    colorService,
    productService,
    productItemService,
    addressService,
    discountService,
    paymentService,
    orderService,
    supplierService,
    importService,
    importDetailService,
    userService,
    adminService
  );

  return controller.getRoutes(sctx.mdlFactory);
}
