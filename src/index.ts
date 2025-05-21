import swagger from "@elysiajs/swagger";
import app from "./app";
import { setupUserModule } from "./module/user";
import { mongodbService } from "./shared/common/mongodb";
import setupMiddlewares from "./shared/middleware/index";
import { setupCartModule } from "./module/cart";
import setupAdminMiddlewares from "./shared/middleware/admin";
import { setupAdminModule } from "./module/admin";
import { setupBrandModule } from "./module/brand";
import { setupImagekitModule } from "./module/imagekit";
import { setupCateModule } from "./module/category";
import { setupSizeModule } from "./module/size";
import { setupProductModule } from "./module/product";
import { setupProductItemModule } from "./module/productitem";
import { setupAddressModule } from "./module/address";
import { setupDiscountModule } from "./module/discount";
import { setupPaymentModule } from "./module/payment";

async function bootServer(port: number) {
  // Connect mongodb
  await mongodbService.connect();

  const sctx = {
    mdlFactory: setupMiddlewares(),
  };

  const sctxadmin = {
    mdlFactory: setupAdminMiddlewares(),
  }
  // create module
  const userModule = setupUserModule(sctx);
  const cartModule = setupCartModule(sctx);
  const brandModule = setupBrandModule(sctx);
  const cateModule = setupCateModule(sctx);
  const sizeModule = setupSizeModule(sctx);
  const productModule = setupProductModule(sctx);
  const productItemModule = setupProductItemModule(sctx);
  const imgekitModule = setupImagekitModule(sctx);
  const addressMoudle = setupAddressModule(sctx);
  const discountModule = setupDiscountModule(sctx);
  const paymentModule = setupPaymentModule(sctx);
  const adminModule = setupAdminModule(sctxadmin);
  // setupModule
  app.use(userModule);
  app.use(cartModule);
  app.use(brandModule);
  app.use(cateModule);
  app.use(sizeModule);
  app.use(productModule);
  app.use(productItemModule);
  app.use(adminModule);
  app.use(imgekitModule);
  app.use(addressMoudle);
  app.use(paymentModule);
  app.use(discountModule);
  app.use(swagger());
  // important, required listen(port) to run app
  app.listen(port);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}

bootServer(8080);
