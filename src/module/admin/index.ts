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
import { PaymentService } from "../payment/service";
import { MongodbPaymentRepository } from "../payment/service/mongodb";
import { ProductService } from "../product/service";
import { MongodbProductRepository } from "../product/service/mongodb";
import { ProductItemService } from "../productitem/service";
import { MongodbProductItemRepository } from "../productitem/service/mongodb";
import { SizeService } from "../size/service";
import { MongodbSizeRepository } from "../size/service/mongodb";
import { UserService } from "../user/service";
import { MongodbUserRepository } from "../user/service/mongodb";
import { HttpAdminController } from "./controller";
import { AdminService } from "./service";
import { MongodbAdminRepository } from "./service/mongodb";

export function setupAdminModule(sctx: ServiceContext) {
    const brandRepository = new MongodbBrandRepository();
    const cateRepository = new MongodbCateRepository();
    const sizeRepository = new MongodbSizeRepository();
    const colorRepository = new MongodbColorRepository();
    const productRepository = new MongodbProductRepository();
    const productItemRepository  = new MongodbProductItemRepository();
    const addressRepository = new MongodbAddressRepository();
    const discountRepository = new MongodbDiscountRepository();
    const paymentRepository = new MongodbPaymentRepository();
    const userRepository = new MongodbUserRepository();
    const adminRepository = new MongodbAdminRepository();

    const brandService = new BrandService(brandRepository);
    const cateService = new CateService(cateRepository);
    const sizeService = new SizeService(sizeRepository);
    const colorService = new ColorService(colorRepository);
    const productService = new ProductService(productRepository);
    const productItemService = new ProductItemService(productItemRepository);
    const addressService = new AddressService(addressRepository);
    const discountService = new DiscountService(discountRepository);
    const paymentService = new PaymentService(paymentRepository);
    const imageKitService = new ImagekitService();
    const userService = new UserService(userRepository, imageKitService);
    const adminService = new AdminService(adminRepository);

    const controller = new HttpAdminController(
        brandService, 
        cateService, 
        sizeService,
        colorService,
        productService,
        productItemService,
        addressService,
        discountService,
        paymentService,
        userService,
        adminService);

    return controller.getRoutes(sctx.mdlFactory);
}