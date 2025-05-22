import Elysia, { Context } from "elysia";
import { MdlFactory, TokenType } from "../../../shared/interface";
import { IBrandService } from "../../brand/interface";
import { IAdminService } from "../interface";
import { ICateService } from "../../category/interface";
import { ISizeService } from "../../size/interface";
import { successResponse } from "../../../shared/utils/response";
import { IColorService } from "../../color/interface";
import { IProductService } from "../../product/interface";
import { IProductItemService } from "../../productitem/interface";
import { ICreateBrandForm, IUpdateBrandForm } from "../../brand/model";
import { ICreateCateForm, IUpdateCateForm } from "../../category/model";
import { ICreateSizeForm, IUpdateSizeForm } from "../../size/model";
import { ICreateColorForm, IUpdateColorForm } from "../../color/model";
import { ICreateProductForm, IUpdateProductForm } from "../../product/model";
import { createProductItemSchema, ICreateProductItemForm, IUpdateProductItemForm } from "../../productitem/model";
import { ObjectId } from "mongodb";
import { IUserService } from "../../user/interface";
import { AuthContext } from "../../../shared/middleware";
import { ErrTokenInvalid } from "../../../shared/utils/error";
import { IImageKitService } from "../../imagekit/interface";
import { IAddressService } from "../../address/interface";
import { createDiscountSchema, ICreateDiscountForm, IUpdateDiscountForm } from "../../discount/model";
import { IDiscountService } from "../../discount/interface";
import { createPaymentSchema, ICreatePayment, IUpdatePayment } from "../../payment/model";
import { IPaymentService } from "../../payment/interface";

export class HttpAdminController {
    constructor(
        private readonly brandService: IBrandService,
        private readonly cateService: ICateService,
        private readonly sizeService: ISizeService,
        private readonly colorService: IColorService,
        private readonly productService: IProductService,
        private readonly productItemService: IProductItemService,
        private readonly addressService: IAddressService,
        private readonly discountService: IDiscountService,
        private readonly paymentService : IPaymentService,
        private readonly usersService: IUserService,
        private readonly adminService: IAdminService
    ) { }
    async renewTokenAdmin(ctx: AuthContext) {
        const token = ctx.token;
        if (ctx.decoded.type !== TokenType.RefreshToken)
            throw ErrTokenInvalid.withLog("Not the expected token");

        const data = await this.usersService.renewTokenAdmin(token);

        return successResponse(data, ctx);
    }
    // *******brand*******
    async insertBrand(ctx: Context) {
        const form = ctx.body as ICreateBrandForm;
        const data = await this.brandService.create(form);
        return successResponse(data, ctx);
    }
    async updateBrand(ctx: Context) {
        const id = ctx.query.id;
        const form = ctx.body as IUpdateBrandForm;
        const data = await this.brandService.update(id, form);
        return successResponse(data, ctx);
    }
    async deleteBrand(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.brandService.delete(id);
        return successResponse(data, ctx);
    }
    async restoreBrand(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.brandService.restore(id);
        return successResponse(data, ctx);
    }
    async getAllBrandActive(ctx: Context) {
        const data = await this.brandService.getAllBrandActive();
        return successResponse(data, ctx);
    }
    async getAllBrandInactive(ctx: Context) {
        const data = await this.brandService.getAllBrandInactive();
        return successResponse(data, ctx);
    }
    async getAllBrand(ctx: Context) {
        const data = await this.brandService.getAllBrand();
        return successResponse(data, ctx);
    }

    async getBrandByIdAdmin(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.brandService.getByIdAdmin(id);
        return successResponse(data, ctx);
    }
    async getBrandByNameAdmin(ctx: Context) {
        const nameBrand = ctx.query.nameBrand;
        const data = await this.brandService.getByNameAdmin(nameBrand);
        return successResponse(data, ctx);
    }
    //**********cate**********

    async insertCate(ctx: Context) {
        const form = ctx.body as ICreateCateForm;
        const data = await this.cateService.create(form);
        return successResponse(data, ctx);
    }
    async updateCate(ctx: Context) {
        const id = ctx.query.id;
        const form = ctx.body as IUpdateCateForm;
        const data = await this.cateService.update(id, form);
        return successResponse(data, ctx);
    }
    async deleteCate(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.cateService.delete(id);
        return successResponse(data, ctx);
    }
    async restoreCate(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.cateService.restore(id);
        return successResponse(data, ctx);
    }
    async getAllCateActive(ctx: Context) {
        const data = await this.cateService.getAllCateActive();
        return successResponse(data, ctx);
    }
    async getAllCateInactive(ctx: Context) {
        const data = await this.cateService.getAllCateInactive();
        return successResponse(data, ctx);
    }
    async getAllCate(ctx: Context) {
        const data = await this.cateService.getAllCate();
        return successResponse(data, ctx);
    }
    async getCateByIdAdmin(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.cateService.getByIdAdmin(id);
        return successResponse(data, ctx);
    }
    async getCateByNameAdmin(ctx: Context) {
        const nameCate = ctx.query.nameCate;
        const data = await this.cateService.getByNameAdmin(nameCate);
        return successResponse(data, ctx);
    }
    //**********size**********
    private async createSize(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const form = ctx.body as ICreateSizeForm;
        const data = await this.sizeService.create(form);
        return successResponse(data, ctx);
    }
    private async updateSize(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const form = ctx.body as IUpdateSizeForm;
        const data = await this.sizeService.update(id, form);
        return successResponse(data, ctx);
    }
    private async deleteSize(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.sizeService.delete(id);
        return successResponse(data, ctx);
    }
    private async restoreSize(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.sizeService.restore(id);
        return successResponse(data, ctx);
    }
    private async getSizeByIdAdmin(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.sizeService.getByIdAdmin(id);
        return successResponse(data, ctx);
    }
    private async getSizeByNameAdmin(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const nameSize = ctx.query.nameSize;
        const data = await this.sizeService.getByNameAdmin(nameSize);
        return successResponse(data, ctx);
    }
    private async getAllActiveSize(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.sizeService.getAllActive();
        return successResponse(data, ctx);
    }
    private async getAllInactiveSize(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.sizeService.getAllInactive();
        return successResponse(data, ctx);
    }
    private async getAllSize(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.sizeService.getAll();
        return successResponse(data, ctx);
    }
    //**********color**********
    private async createColor(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const form = ctx.body as ICreateColorForm;
        const data = await this.colorService.create(form);
        return successResponse(data, ctx);
    }
    private async updateColor(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const form = ctx.body as IUpdateColorForm;
        const data = await this.colorService.update(id, form);
        return successResponse(data, ctx);
    }
    private async deleteColor(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.colorService.delete(id);
        return successResponse(data, ctx);
    }
    private async restoreColor(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.colorService.restore(id);
        return successResponse(data, ctx);
    }
    private async getColorByIdAdmin(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.colorService.getByIdAdmin(id);
        return successResponse(data, ctx);
    }
    private async getColorByNameAdmin(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const nameColor = ctx.query.nameColor;
        const data = await this.colorService.getByNameAdmin(nameColor);
        return successResponse(data, ctx);
    }
    private async getAllActiveColor(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.colorService.getAllColorActive();
        return successResponse(data, ctx);
    }
    private async getAllInactiveColor(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.colorService.getAllColorInactive();
        return successResponse(data, ctx);
    }
    private async getAllColor(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.colorService.getAllColor();
        return successResponse(data, ctx);
    }
    //**********product**********
    private async createProduct(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const form = ctx.body as ICreateProductForm;
        const data = await this.productService.create(form);
        return successResponse(data, ctx);
    }
    private async updateProduct(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const form = ctx.body as IUpdateProductForm;
        const data = await this.productService.update(id, form);
        return successResponse(data, ctx);
    }
    private async deleteProduct(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.productService.delete(id);
        return successResponse(data, ctx);
    }
    private async restoreProduct(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.productService.restore(id);
        return successResponse(data, ctx);
    }
    private async getProductByIdAdmin(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.productService.getByIdAdmin(id);
        return successResponse(data, ctx);
    }
    private async getProductByNameAdmin(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const nameProduct = ctx.query.nameProduct;
        const data = await this.productService.getByNameAdmin(nameProduct);
        return successResponse(data, ctx);
    }
    private async getAllActiveProduct(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.productService.getAllProductActive();
        return successResponse(data, ctx);
    }
    private async getAllInactiveProduct(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.productService.getAllProductInactive();
        return successResponse(data, ctx);
    }
    private async getAllProduct(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.productService.getAllProduct();
        return successResponse(data, ctx);
    }
    //**********productItem**********
    private async createProductItem(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const body = ctx.body as ICreateProductItemForm;
        const form = createProductItemSchema.parse({
            ...body,
            _id: new ObjectId(),
            productId: new ObjectId(body.productId),
            sizeId: new ObjectId(body.sizeId),
            colorId: new ObjectId(body.colorId),
        });
        const data = await this.productItemService.create(form);
        return successResponse(data, ctx);
    }
    private async updateProductItem(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const form = ctx.body as IUpdateProductItemForm;
        const data = await this.productItemService.update(id, form);
        return successResponse(data, ctx);
    }
    private async deleteProductItem(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.productItemService.delete(id);
        return successResponse(data, ctx);
    }
    private async restoreProductItem(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.productItemService.restore(id);
        return successResponse(data, ctx);
    }
    private async getProductItemByIdAdmin(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const id = ctx.query.id;
        const data = await this.productItemService.getByIdAdmin(id);
        return successResponse(data, ctx);
    }
    private async getProductItemByNameAdmin(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const nameProductItem = ctx.query.nameProductItem;
        const data = await this.productItemService.getByNameAdmin(nameProductItem);
        return successResponse(data, ctx);
    }
    private async getAllActiveProductItem(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.productItemService.getAllProductItemActive();
        return successResponse(data, ctx);
    }
    private async getAllInactiveProductItem(ctx: Context) { // Replace 'any' with the actual type of 'ctx'  
        const data = await this.productItemService.getAllProductItemInactive();
        return successResponse(data, ctx);
    }
    private async getAllProductItem(ctx: Context) { // Replace 'any' with the actual type of 'ctx'
        const data = await this.productItemService.getAllProductItem();
        return successResponse(data, ctx);
    }
    //***********address ******** */
    private async getAllAddressByUserId(ctx: AuthContext) {
        const user_id = ctx.query.userId;
        const data = await this.addressService.getAllAddressByUserId(user_id);
        return successResponse(data, ctx);
    }
    private async getAddressById(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.addressService.getAddressById(id);
        return successResponse(data, ctx);
    }
    private async getAllAddress(ctx: Context) {
        const data = await this.addressService.getAllAddress();
        return successResponse(data, ctx);
    }
    private async syncGHNProvinces(ctx: AuthContext) {
        await this.addressService.syncGHNProvinces();
        return successResponse("Đồng bộ dữ liệu từ GHN thành công", ctx);
    }
    private async syncGHNDistricts(ctx: AuthContext) {
        await this.addressService.syncGHNDistricts();
        return successResponse("Đồng bộ dữ liệu từ GHN thành công", ctx);
    }
    private async syncGHNWards(ctx: AuthContext) {
        await this.addressService.syncGHNWards();
        return successResponse("Đồng bộ dữ liệu từ GHN thành công", ctx);
    }
    //***********discount********* */
    private async createDiscount(ctx: Context) {
        const body = ctx.body as ICreateDiscountForm;
        const form = createDiscountSchema.parse({
            ...body,
            _id: new ObjectId(),
        });
        const data = await this.discountService.create(form);
        return successResponse(data, ctx);
    }
    private async updateDiscount(ctx: Context) {
        const id = ctx.query.id;
        const form = ctx.body as IUpdateDiscountForm;
        const data = await this.discountService.update(id, form);
        return successResponse(data, ctx);
    }
    private async deleteDiscount(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.discountService.delete(id);
        return successResponse(data, ctx);
    }
    private async restoreDiscount(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.discountService.restore(id);
        return successResponse(data, ctx);
    }
    private async getAllDiscount(ctx: Context) {
        const data = await this.discountService.getAllDiscount();
        return successResponse(data, ctx);
    }
    private async getAllDiscountActive(ctx: Context) {
        const data = await this.discountService.getAllDiscountActive();
        return successResponse(data, ctx);
    }
    private async getAllDiscountInactive(ctx: Context) {
        const data = await this.discountService.getAllDiscountInactive();
        return successResponse(data, ctx);
    }
    private async getDiscountByIdAdmin(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.discountService.getByIdAdmin(id);
        return successResponse(data, ctx);
    }
    private async getDiscountByCodeAdmin(ctx: Context){
        const code = ctx.query.codeDiscount;
        const data = await this.discountService.getByCodeAdmin(code);
        return successResponse(data, ctx);
    }
    //***********payment********* */
    private async createPayment(ctx: Context) {
        const body = ctx.body as ICreatePayment;
        const form = createPaymentSchema.parse({
            ...body,
            _id: new ObjectId(),
        });
        const data = await this.paymentService.create(form);
        return successResponse(data, ctx);
    }
    private async updatePayment(ctx: Context) {
        const id = ctx.query.id;
        const form = ctx.body as IUpdatePayment;
        const data = await this.paymentService.update(id, form);
        return successResponse(data, ctx);
    }
    private async deletePayment(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.paymentService.delete(id);
        return successResponse(data, ctx);
    }
    private async restorePayment(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.paymentService.restore(id);
        return successResponse(data, ctx);
    }
    private async getAllPayment(ctx: Context) {
        const data = await this.paymentService.getAllPayment();
        return successResponse(data, ctx);
    }
    private async getAllPaymentActive(ctx: Context) {
        const data = await this.paymentService.getAllPaymentActive();
        return successResponse(data, ctx);
    }
    private async getAllPaymentInactive(ctx: Context) {
        const data = await this.paymentService.getAllPaymentInactive();
        return successResponse(data, ctx);
    }
    private async getPaymentByIdAdmin(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.paymentService.getByIdAdmin(id);
        return successResponse(data, ctx);
    }
    private async getPaymentByNameAdmin(ctx: Context){
        const name = ctx.query.namePayment;
        const data = await this.paymentService.getByNameAdmin(name);
        return successResponse(data, ctx);
    }
    getRoutes(mdlFactory: MdlFactory) {
        const module = new Elysia({ prefix: "/admin" })
            .derive(mdlFactory.auth)
            .get("/renew", this.renewTokenAdmin.bind(this));
        const brandRoutes = new Elysia({ prefix: "/brand" })
            .derive(mdlFactory.auth)
            .get("", this.getAllBrand.bind(this))
            .get("/active", this.getAllBrandActive.bind(this))
            .get("/inactive", this.getAllBrandInactive.bind(this))
            .get("/search/id", this.getBrandByIdAdmin.bind(this))
            .get("/search/name", this.getBrandByNameAdmin.bind(this))
            .post("/create", this.insertBrand.bind(this))
            .put("/update", this.updateBrand.bind(this))
            .put("/delete", this.deleteBrand.bind(this))
            .put("/restore", this.restoreBrand.bind(this));
        const cateRoutes = new Elysia({ prefix: "/cate" })
            .derive(mdlFactory.auth)
            .get("", this.getAllCate.bind(this))
            .get("/active", this.getAllCateActive.bind(this))
            .get("/inactive", this.getAllCateInactive.bind(this))
            .get("/search/id", this.getCateByIdAdmin.bind(this))
            .get("/search/name", this.getCateByNameAdmin.bind(this))
            .post("/create", this.insertCate.bind(this))
            .put("/update", this.updateCate.bind(this))
            .put("/delete", this.deleteCate.bind(this))
            .put("/restore", this.restoreCate.bind(this));
        const sizeRoutes = new Elysia({ prefix: "/size" })
            .derive(mdlFactory.auth)
            .get("", this.getAllSize.bind(this))
            .get("/active", this.getAllActiveSize.bind(this))
            .get("/inactive", this.getAllInactiveSize.bind(this))
            .get("/search/id", this.getSizeByIdAdmin.bind(this))
            .get("/search/name", this.getSizeByNameAdmin.bind(this))
            .post("/create", this.createSize.bind(this))
            .put("/update", this.updateSize.bind(this))
            .put("/delete", this.deleteSize.bind(this))
            .put("/restore", this.restoreSize.bind(this));
        const colorRoutes = new Elysia({ prefix: "/color" })
            .derive(mdlFactory.auth)
            .get("", this.getAllColor.bind(this))
            .get("/active", this.getAllActiveColor.bind(this))
            .get("/inactive", this.getAllInactiveColor.bind(this))
            .get("/search/id", this.getColorByIdAdmin.bind(this))
            .get("/search/name", this.getColorByNameAdmin.bind(this))
            .post("/create", this.createColor.bind(this))
            .put("/update", this.updateColor.bind(this))
            .put("/delete", this.deleteColor.bind(this))
            .put("/restore", this.restoreColor.bind(this));
        const productRoutes = new Elysia({ prefix: "/product" })
            .derive(mdlFactory.auth)
            .get("", this.getAllProduct.bind(this))
            .get("/active", this.getAllActiveProduct.bind(this))
            .get("/inactive", this.getAllInactiveProduct.bind(this))
            .get("/search/id", this.getProductByIdAdmin.bind(this))
            .get("/search/name", this.getProductByNameAdmin.bind(this))
            .post("/create", this.createProduct.bind(this))
            .put("/update", this.updateProduct.bind(this))
            .put("/delete", this.deleteProduct.bind(this))
            .put("/restore", this.restoreProduct.bind(this));
        const productItemRoutes = new Elysia({ prefix: "/productitem" })
            .derive(mdlFactory.auth)
            .get("", this.getAllProductItem.bind(this))
            .get("/active", this.getAllActiveProductItem.bind(this))
            .get("/inactive", this.getAllInactiveProductItem.bind(this))
            .get("/search/id", this.getProductItemByIdAdmin.bind(this))
            .get("/search/name", this.getProductItemByNameAdmin.bind(this))
            .post("/create", this.createProductItem.bind(this))
            .put("/update", this.updateProductItem.bind(this))
            .put("/delete", this.deleteProductItem.bind(this))
            .put("/restore", this.restoreProductItem.bind(this));
        const addressRoutes = new Elysia({ prefix: "/address" })
            .derive(mdlFactory.auth)
            .get("", this.getAllAddress.bind(this))
            .get("/sync-ghn-province", this.syncGHNProvinces.bind(this))
            .get("/sync-ghn-district", this.syncGHNDistricts.bind(this))
            .get("/sync-ghn-ward", this.syncGHNWards.bind(this))
            .get("/search/userId", this.getAllAddressByUserId.bind(this))
            .get("/search", this.getAddressById.bind(this))
        const discountRoutes = new Elysia({ prefix: "/discount" })
            .derive(mdlFactory.auth)
            .get("", this.getAllDiscount.bind(this))
            .get("/active", this.getAllDiscountActive.bind(this))
            .get("/inactive", this.getAllDiscountInactive.bind(this))
            .get("/search/id", this.getDiscountByIdAdmin.bind(this))
            .get("/search/code", this.getDiscountByCodeAdmin.bind(this))
            .post("/create", this.createDiscount.bind(this))
            .put("/update", this.updateDiscount.bind(this))
            .put("/delete", this.deleteDiscount.bind(this))
            .put("/restore", this.restoreDiscount.bind(this));
        const paymentRoutes = new Elysia({ prefix: "/payment" })
            .derive(mdlFactory.auth)
            .get("", this.getAllPayment.bind(this))
            .get("/active", this.getAllPaymentActive.bind(this))
            .get("/inactive", this.getAllPaymentInactive.bind(this))
            .get("/search/id", this.getPaymentByIdAdmin.bind(this))
            .get("/search/name", this.getPaymentByNameAdmin.bind(this))
            .post("/create", this.createPayment.bind(this))
            .put("/update", this.updatePayment.bind(this))
            .put("/delete", this.deletePayment.bind(this))
            .put("/restore", this.restorePayment.bind(this));
        module.use(paymentRoutes);
        module.use(discountRoutes);
        module.use(addressRoutes);
        module.use(productItemRoutes);
        module.use(productRoutes);
        module.use(colorRoutes);
        module.use(sizeRoutes);
        module.use(cateRoutes);
        module.use(brandRoutes);
        return module;
    }
}