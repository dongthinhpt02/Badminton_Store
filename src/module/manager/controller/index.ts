import Elysia, { Context } from "elysia";
import { IBrandService } from "../../brand/interface";
import { successResponse } from "../../../shared/utils/response";
import { ICateService } from "../../category/interface";
import { IProductService } from "../../product/interface";
import { ISizeService } from "../../size/interface";
import { IColorService } from "../../color/interface";
import { ICreateProductForm, IUpdateProductForm } from "../../product/model";
import { IProductItemService } from "../../productitem/interface";
import { ObjectId } from "mongodb";
import { createProductItemSchema, ICreateProductItemForm, IUpdateProductItemForm } from "../../productitem/model";
import { MdlFactory, TokenType } from "../../../shared/interface";
import { dateRangeSchema } from "../../order/model";
import { IOrderService } from "../../order/interface";
import { IUserService } from "../../user/interface";
import { ErrTokenInvalid } from "../../../shared/utils/error";
import { AuthContext } from "../../../shared/middleware";

export class HttpManagerController {
    constructor(
        private readonly userService: IUserService,
        private readonly brandService: IBrandService,
        private readonly cateService: ICateService,
        private readonly sizeService: ISizeService,
        private readonly colorService: IColorService,
        private readonly productService: IProductService,
        private readonly productItemService: IProductItemService,
        private readonly orderService: IOrderService
    ) { }
    async getAllUser(ctx: Context) {
        const data = await this.userService.getAllUser();
        return successResponse(data, ctx);
    }
    async getAllShipper(ctx: Context) {
        const data = await this.userService.getAllShipper();
        return successResponse(data, ctx);
    }
    async renewTokenManager(ctx: AuthContext) {
        const token = ctx.token;
        if (ctx.decoded.type !== TokenType.RefreshToken)
            throw ErrTokenInvalid.withLog("Not the expected token");

        const data = await this.userService.renewTokenManager(token);
        return successResponse(data, ctx);
    }

    async getAllAcitveBrand(ctx: Context) {
        const data = await this.brandService.getAllBrandActive();
        return successResponse(data, ctx);
    }
    async getAllActiveCate(ctx: Context) {
        const data = await this.cateService.getAllCateActive();
        return successResponse(data, ctx);
    }
    async getAllActiveSize(ctx: Context) {
        const data = await this.sizeService.getAllActive();
        return successResponse(data, ctx);
    }
    async getAllActiveColor(ctx: Context) {
        const data = await this.colorService.getAllColorActive();
        return successResponse(data, ctx);
    }
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

    private async getAllOrder(ctx: Context) {
        const data = await this.orderService.getAllOrder();
        return successResponse(data, ctx);
    }
    private async getOrderDetail(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.orderService.getOrderDetail(id);
        return successResponse(data, ctx);
    }
    private async getAllOrderProcessing(ctx: Context) {
        const data = await this.orderService.getAllOrderProcessing();
        return successResponse(data, ctx);
    }
    private async getAllOrderShipped(ctx: Context) {
        const data = await this.orderService.getAllOrderShipped();
        return successResponse(data, ctx);
    }
    private async getAllOrderDelivered(ctx: Context) {
        const data = await this.orderService.getAllOrderDelivered();
        return successResponse(data, ctx);
    }
    private async getAllOrderCompleted(ctx: Context) {
        const data = await this.orderService.getAllOrderCompleted();
        return successResponse(data, ctx);
    }
    private async getAllOrderCancelled(ctx: Context) {
        const data = await this.orderService.getAllOrderCancelled();
        return successResponse(data, ctx);
    }
    private async getAllOrderCreatedBetweenTime(ctx: Context) {
        const { startDate, endDate } = dateRangeSchema.parse(ctx.query);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const data = await this.orderService.getAllOrderCreatedBetweenTime(start, end);
        return successResponse(data, ctx);
    }
    private async getAllOrderShippedBetweenTime(ctx: Context) {
        const { startDate, endDate } = dateRangeSchema.parse(ctx.query);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const data = await this.orderService.getAllOrderShippedBetweenTime(start, end);
        return successResponse(data, ctx);
    }
    private async getAllOrderDeliveredBetweenTime(ctx: Context) {
        const { startDate, endDate } = dateRangeSchema.parse(ctx.query);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const data = await this.orderService.getAllOrderDeliveredBetweenTime(start, end);
        return successResponse(data, ctx);
    }
    private async getAllOrderCompletedBetweenTime(ctx: Context) {
        const { startDate, endDate } = dateRangeSchema.parse(ctx.query);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const data = await this.orderService.getAllOrderCompletedBetweenTime(start, end);
        return successResponse(data, ctx);
    }
    private async getAllOrderByname(ctx: Context) {
        const name = ctx.query.fullname;
        const data = await this.orderService.getAllOrderByName(name);
        return successResponse(data, ctx);
    }
    private async getOrderByOrderId(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.orderService.getOrderByOrderId(id);
        return successResponse(data, ctx);
    }
    private async getAllOrderByUserId(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.orderService.getAllOrderByUserId(id);
        return successResponse(data, ctx);
    }
    private async getAllOrderByShipperId(ctx: Context) {
        const id = ctx.query.id;
        const data = await this.orderService.getAllOrderByShipperId(id);
        return successResponse(data, ctx);
    }
    getRoutes(mdlFactory: MdlFactory) {
        const module = new Elysia({ prefix: "/manager" })
            .derive(mdlFactory.auth)
            .get("/renew", this.renewTokenManager.bind(this))
            .get("/get-all-user", this.getAllUser.bind(this))
            .get("/get-all-shipper", this.getAllShipper.bind(this))
        const brandRoutes = new Elysia({ prefix: "/brand" })
            .get("", this.getAllAcitveBrand.bind(this))
        const cateRoutes = new Elysia({ prefix: "/cate" })
            .get("", this.getAllActiveCate.bind(this))
        const sizeRoutes = new Elysia({ prefix: "/size" })
            .get("", this.getAllActiveSize.bind(this))
        const colorRoutes = new Elysia({ prefix: "/color" })
            .get("", this.getAllActiveColor.bind(this))
        const productRoutes = new Elysia({ prefix: "/product" })
            .get("", this.getAllProduct.bind(this))
            .get("/active", this.getAllActiveProduct.bind(this))
            .get("/inactive", this.getAllInactiveProduct.bind(this))
            .get("/search/id", this.getProductByIdAdmin.bind(this))
            .get("/search/name", this.getProductByNameAdmin.bind(this))
            .post("/create", this.createProduct.bind(this))
            .put("/update", this.updateProduct.bind(this))
            .put("/delete", this.deleteProduct.bind(this))
            .put("/restore", this.restoreProduct.bind(this))
        const productItemRoutes = new Elysia({ prefix: "/productitem" })
            .get("", this.getAllProductItem.bind(this))
            .get("/active", this.getAllActiveProductItem.bind(this))
            .get("/inactive", this.getAllInactiveProductItem.bind(this))
            .get("/search/id", this.getProductItemByIdAdmin.bind(this))
            .get("/search/name", this.getProductItemByNameAdmin.bind(this))
            .post("/create", this.createProductItem.bind(this))
            .put("/update", this.updateProductItem.bind(this))
            .put("/delete", this.deleteProductItem.bind(this))
            .put("/restore", this.restoreProductItem.bind(this))
        const order = new Elysia({ prefix: "/order" })
            .get("/all-order", this.getAllOrder.bind(this))
            .get("/detail-order", this.getOrderDetail.bind(this))
            .get("/all-order-processing", this.getAllOrderProcessing.bind(this))
            .get("/all-order-shipped", this.getAllOrderShipped.bind(this))
            .get("/all-order-delivered", this.getAllOrderDelivered.bind(this))
            .get("/all-order-completed", this.getAllOrderCompleted.bind(this))
            .get("/all-order-cancelled", this.getAllOrderCancelled.bind(this))
            .get("/order-processing/time", this.getAllOrderCreatedBetweenTime.bind(this))
            .get("/order-shipped/time", this.getAllOrderShippedBetweenTime.bind(this))
            .get("/order-delivered/time", this.getAllOrderDeliveredBetweenTime.bind(this))
            .get("/order-completed/time", this.getAllOrderCompletedBetweenTime.bind(this))
            .get("/by-name", this.getAllOrderByname.bind(this))
            .get("/order-id", this.getOrderByOrderId.bind(this))
            .get("/user-id", this.getAllOrderByUserId.bind(this))
            .get("/shipper-id", this.getAllOrderByShipperId.bind(this))

        module.use(order);
        module.use(sizeRoutes);
        module.use(colorRoutes);
        module.use(cateRoutes);
        module.use(productRoutes);
        module.use(productItemRoutes);
        module.use(brandRoutes);
        return module;
    }
}