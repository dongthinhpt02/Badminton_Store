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
import {
  createProductItemSchema,
  ICreateProductItemForm,
  IUpdateProductItemForm,
} from "../../productitem/model";
import { ObjectId } from "mongodb";
import { IUserService } from "../../user/interface";
import { AuthContext } from "../../../shared/middleware";
import { ErrTokenInvalid } from "../../../shared/utils/error";
import { IImageKitService } from "../../imagekit/interface";
import { IAddressService } from "../../address/interface";
import {
  createDiscountSchema,
  ICreateDiscountForm,
  IUpdateDiscountForm,
} from "../../discount/model";
import { IDiscountService } from "../../discount/interface";
import {
  createPaymentSchema,
  ICreatePayment,
  IUpdatePayment,
} from "../../payment/model";
import { IPaymentService } from "../../payment/interface";
import { IOrderService } from "../../order/interface";
import { dateRangeSchema, UpdateDeliveredOrderForm } from "../../order/model";
import { signupSchema } from "../../user/model";
import { ISizeTypeService } from "../../sizetype/interface";
import { ICreateSizeTypeForm, IUpdateSizeTypeForm } from "../../sizetype/model";
import { ISupplierService } from "../../supplier/interface";
import { ICreateSupplierForm, IUpdateSupplierForm } from "../../supplier/model";
import { IImportService } from "../../import/interface";
import { ICreateImportForm } from "../../import/model";
import { IImportDetailService } from "../../importdetail/interface";
import { ICreateImportDetailForm } from "../../importdetail/model";

export class HttpAdminController {
  constructor(
    private readonly brandService: IBrandService,
    private readonly cateService: ICateService,
    private readonly sizeService: ISizeService,
    private readonly sizeTypeService: ISizeTypeService,
    private readonly colorService: IColorService,
    private readonly productService: IProductService,
    private readonly productItemService: IProductItemService,
    private readonly addressService: IAddressService,
    private readonly discountService: IDiscountService,
    private readonly paymentService: IPaymentService,
    private readonly orderService: IOrderService,
    private readonly supplierService: ISupplierService,
    private readonly importService: IImportService,
    private readonly importDetailService: IImportDetailService,
    private readonly usersService: IUserService,
    private readonly adminService: IAdminService
  ) {}
  async signupManager(ctx: Context) {
    const form = signupSchema.parse(ctx.body);
    const data = await this.usersService.signupManager(form);
    return successResponse(data, ctx);
  }
  async renewTokenAdmin(ctx: AuthContext) {
    const token = ctx.token;
    if (ctx.decoded.type !== TokenType.RefreshToken)
      throw ErrTokenInvalid.withLog("Not the expected token");

    const data = await this.usersService.renewTokenAdmin(token);

    return successResponse(data, ctx);
  }
  // *******user********
  async lockUser(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.usersService.lockUser(id);
    return successResponse(data, ctx);
  }
  async restoreUser(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.usersService.restoreUser(id);
    return successResponse(data, ctx);
  }
  async getAllUser(ctx: Context) {
    const data = await this.usersService.getAllUser();
    return successResponse(data, ctx);
  }
  async getAllActiveUser(ctx: Context) {
    const data = await this.usersService.getAllActiveUser();
    return successResponse(data, ctx);
  }
  async getAllInactiveUser(ctx: Context) {
    const data = await this.usersService.getAllInactiveUser();
    return successResponse(data, ctx);
  }
  async getAllManager(ctx: Context) {
    const data = await this.usersService.getAllManager();
    return successResponse(data, ctx);
  }
  async getAllShipper(ctx: Context) {
    const data = await this.usersService.getAllShipper();
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
  private async createSize(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const form = ctx.body as ICreateSizeForm;
    const data = await this.sizeService.create(form);
    return successResponse(data, ctx);
  }
  private async updateSize(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const form = ctx.body as IUpdateSizeForm;
    const data = await this.sizeService.update(id, form);
    return successResponse(data, ctx);
  }
  private async deleteSize(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.sizeService.delete(id);
    return successResponse(data, ctx);
  }
  private async restoreSize(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.sizeService.restore(id);
    return successResponse(data, ctx);
  }
  private async getSizeByIdAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.sizeService.getByIdAdmin(id);
    return successResponse(data, ctx);
  }
  private async getSizeByNameAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const nameSize = ctx.query.nameSize;
    const data = await this.sizeService.getByNameAdmin(nameSize);
    return successResponse(data, ctx);
  }
  private async getAllActiveSize(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.sizeService.getAllActive();
    return successResponse(data, ctx);
  }
  private async getAllInactiveSize(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.sizeService.getAllInactive();
    return successResponse(data, ctx);
  }
  private async getAllSize(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.sizeService.getAll();
    return successResponse(data, ctx);
  }
  //**********sizetype**********
  private async createSizeType(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const form = ctx.body as ICreateSizeTypeForm;
    const data = await this.sizeTypeService.create(form);
    return successResponse(data, ctx);
  }
  private async updateSizeType(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const form = ctx.body as IUpdateSizeTypeForm;
    const data = await this.sizeTypeService.update(id, form);
    return successResponse(data, ctx);
  }
  private async deleteSizeType(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.sizeTypeService.delete(id);
    return successResponse(data, ctx);
  }
  private async restoreSizeType(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.sizeTypeService.restore(id);
    return successResponse(data, ctx);
  }
  private async getSizeTypeByIdAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.sizeTypeService.getByIdAdmin(id);
    return successResponse(data, ctx);
  }
  private async getSizeTypeByNameAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const nameSizeType = ctx.query.nameSizeType;
    const data = await this.sizeTypeService.getByNameAdmin(nameSizeType);
    return successResponse(data, ctx);
  }
  private async getAllActiveSizeType(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.sizeTypeService.getAllActive();
    return successResponse(data, ctx);
  }
  private async getAllInactiveSizeType(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.sizeTypeService.getAllInactive();
    return successResponse(data, ctx);
  }
  private async getAllSizeType(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.sizeTypeService.getAll();
    return successResponse(data, ctx);
  }
  private async getSizeBySizeTypeId(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const sizeTypeId = ctx.query.sizeTypeId;
    const data = await this.sizeService.getSizeBySizeTypeId(sizeTypeId);
    return successResponse(data, ctx);
  }
  private async getSizeBySizeTypeName(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const sizeTypeName = ctx.query.sizeTypeName;
    const data = await this.sizeService.getSizeBySizeTypeName(sizeTypeName);
    return successResponse(data, ctx);
  }
  //**********color**********
  private async createColor(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const form = ctx.body as ICreateColorForm;
    const data = await this.colorService.create(form);
    return successResponse(data, ctx);
  }
  private async updateColor(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const form = ctx.body as IUpdateColorForm;
    const data = await this.colorService.update(id, form);
    return successResponse(data, ctx);
  }
  private async deleteColor(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.colorService.delete(id);
    return successResponse(data, ctx);
  }
  private async restoreColor(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.colorService.restore(id);
    return successResponse(data, ctx);
  }
  private async getColorByIdAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.colorService.getByIdAdmin(id);
    return successResponse(data, ctx);
  }
  private async getColorByNameAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const nameColor = ctx.query.nameColor;
    const data = await this.colorService.getByNameAdmin(nameColor);
    return successResponse(data, ctx);
  }
  private async getAllActiveColor(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.colorService.getAllColorActive();
    return successResponse(data, ctx);
  }
  private async getAllInactiveColor(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.colorService.getAllColorInactive();
    return successResponse(data, ctx);
  }
  private async getAllColor(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.colorService.getAllColor();
    return successResponse(data, ctx);
  }
  //**********product**********
  private async createProduct(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const form = ctx.body as ICreateProductForm;
    const data = await this.productService.create(form);
    return successResponse(data, ctx);
  }
  private async updateProduct(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const form = ctx.body as IUpdateProductForm;
    const data = await this.productService.update(id, form);
    return successResponse(data, ctx);
  }
  private async deleteProduct(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.productService.delete(id);
    return successResponse(data, ctx);
  }
  private async restoreProduct(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.productService.restore(id);
    return successResponse(data, ctx);
  }
  private async getProductByIdAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.productService.getByIdAdmin(id);
    return successResponse(data, ctx);
  }
  private async getProductByNameAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const nameProduct = ctx.query.nameProduct;
    const data = await this.productService.getByNameAdmin(nameProduct);
    return successResponse(data, ctx);
  }
  private async getAllActiveProduct(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.productService.getAllProductActive();
    return successResponse(data, ctx);
  }
  private async getAllInactiveProduct(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.productService.getAllProductInactive();
    return successResponse(data, ctx);
  }
  private async getAllProduct(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.productService.getAllProduct();
    return successResponse(data, ctx);
  }
  //**********productItem**********
  private async createProductItem(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
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
  private async updateProductItem(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const form = ctx.body as IUpdateProductItemForm;
    const data = await this.productItemService.update(id, form);
    return successResponse(data, ctx);
  }
  private async deleteProductItem(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.productItemService.delete(id);
    return successResponse(data, ctx);
  }
  private async restoreProductItem(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.productItemService.restore(id);
    return successResponse(data, ctx);
  }
  private async getProductItemByIdAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const id = ctx.query.id;
    const data = await this.productItemService.getByIdAdmin(id);
    return successResponse(data, ctx);
  }
  private async getProductItemByNameAdmin(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const nameProductItem = ctx.query.nameProductItem;
    const data = await this.productItemService.getByNameAdmin(nameProductItem);
    return successResponse(data, ctx);
  }
  private async getAllActiveProductItem(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.productItemService.getAllProductItemActive();
    return successResponse(data, ctx);
  }
  private async getAllInactiveProductItem(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
    const data = await this.productItemService.getAllProductItemInactive();
    return successResponse(data, ctx);
  }
  private async getAllProductItem(ctx: Context) {
    // Replace 'any' with the actual type of 'ctx'
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
  private async getDiscountByCodeAdmin(ctx: Context) {
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
  private async getPaymentByNameAdmin(ctx: Context) {
    const name = ctx.query.namePayment;
    const data = await this.paymentService.getByNameAdmin(name);
    return successResponse(data, ctx);
  }
  //***********order********* */
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
  // private async getAllOrderShipped(ctx: Context) {
  //   const data = await this.orderService.getAllOrderShipped();
  //   return successResponse(data, ctx);
  // }
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
    const data = await this.orderService.getAllOrderCreatedBetweenTime(
      start,
      end
    );
    return successResponse(data, ctx);
  }
  // private async getAllOrderShippedBetweenTime(ctx: Context) {
  //   const { startDate, endDate } = dateRangeSchema.parse(ctx.query);
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   const data = await this.orderService.getAllOrderShippedBetweenTime(
  //     start,
  //     end
  //   );
  //   return successResponse(data, ctx);
  // }
  private async getAllOrderDeliveredBetweenTime(ctx: Context) {
    const { startDate, endDate } = dateRangeSchema.parse(ctx.query);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data = await this.orderService.getAllOrderDeliveredBetweenTime(
      start,
      end
    );
    return successResponse(data, ctx);
  }
  private async getAllOrderCompletedBetweenTime(ctx: Context) {
    // const { startDate, endDate } = dateRangeSchema.parse(ctx.query);

    // const data = await this.orderService.getAllOrderCompletedBetweenTime(
    //   startDate,
    //   endDate
    // );
    // return successResponse(data, ctx);
    const { startDate, endDate } = ctx.query;

    // Validate dạng yyyy-mm-dd bằng regex
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return {
        statusCode: 400,
        message: "Invalid date format (yyyy-mm-dd)",
      };
    }

    const data = await this.orderService.getAllOrderCompletedBetweenTime(
      startDate,
      endDate
    );

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
  // private async getAllOrderByShipperId(ctx: Context) {
  //   const id = ctx.query.id;
  //   const data = await this.orderService.getAllOrderByShipperId(id);
  //   return successResponse(data, ctx);
  // }

  private async takeOrderToDelivered(ctx: Context) {
    const id = ctx.query.id;
    const form = ctx.body as UpdateDeliveredOrderForm;
    const data = await this.orderService.takeOrderToDelivered(id, form);
    return successResponse(data, ctx);
  }
  private async cancelOrder(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.orderService.cancelOrderAdmin(id);
    return successResponse(data, ctx);
  }
  //***********Statistic********* */
  private async getStatistic(ctx: Context) {
    const data = await this.orderService.generalStatistic();
    return successResponse(data, ctx);
  }
  private async statisticByStatus(ctx: Context) {
    const data = await this.orderService.statisticByStatus();
    return successResponse(data, ctx);
  }
  private async statisticByTime(ctx: Context) {
    const data = await this.orderService.statisticByTime();
    return successResponse(data, ctx);
  }
  private async getTopSellingProductItem(ctx: Context) {
    const data = await this.orderService.getTopSellingProductItem();
    return successResponse(data, ctx);
  }
  private async getBrandStatistics(ctx: Context) {
    const data = await this.orderService.getBrandStatistics();
    return successResponse(data, ctx);
  }
  private async getCategoryStatistics(ctx: Context) {
    const data = await this.orderService.getCategoryStatistics();
    return successResponse(data, ctx);
  }
  //***********supplier********* */
  private async getAllSupplier(ctx: Context) {
    const data = await this.supplierService.getAll();
    return successResponse(data, ctx);
  }
  private async getAllActiveSupplier(ctx: Context) {
    const data = await this.supplierService.getAllActive();
    return successResponse(data, ctx);
  }
  private async getAllInactiveSupplier(ctx: Context) {
    const data = await this.supplierService.getAllInactive();
    return successResponse(data, ctx);
  }
  private async getSupplierByIdAdmin(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.supplierService.getByIdAdmin(id);
    return successResponse(data, ctx);
  }
  private async getSupplierByNameAdmin(ctx: Context) {
    const nameSupplier = ctx.query.nameSupplier;
    const data = await this.supplierService.getByNameAdmin(nameSupplier);
    return successResponse(data, ctx);
  }
  private async createSupplier(ctx: Context) {
    const form = ctx.body as ICreateSupplierForm;
    const data = await this.supplierService.create(form);
    return successResponse(data, ctx);
  }
  private async updateSupplier(ctx: Context) {
    const id = ctx.query.id;
    const form = ctx.body as IUpdateSupplierForm;
    const data = await this.supplierService.update(id, form);
    return successResponse(data, ctx);
  }
  private async deleteSupplier(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.supplierService.delete(id);
    return successResponse(data, ctx);
  }
  private async restoreSupplier(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.supplierService.restore(id);
    return successResponse(data, ctx);
  }
  //***********import********* */
  private async createImport(ctx: Context) {
    const form = ctx.body as ICreateImportForm;
    const data = await this.importService.create(form);
    return successResponse(data, ctx);
  }
  private async getImportById(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.importService.getById(id);
    return successResponse(data, ctx);
  }
  private async getAllImport(ctx: Context) {
    const data = await this.importService.getAll();
    return successResponse(data, ctx);
  }
  private async getImportByTitle(ctx: Context) {
    const title = ctx.query.title;
    const data = await this.importService.getByTitle(title);
    return successResponse(data, ctx);
  }
  private async getImportByTimeRange(ctx: Context) {
    const { startDate, endDate } = dateRangeSchema.parse(ctx.query);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const data = await this.importService.getByTimeRange(start, end);
    return successResponse(data, ctx);
  }
  //***********import detail********* */
  private async createImportDetail(ctx: Context) {
    const form = ctx.body as ICreateImportDetailForm;
    const data = await this.importDetailService.create(form);
    return successResponse(data, ctx);
  }
  private async getImportDetailById(ctx: Context) {
    const id = ctx.query.id;
    const data = await this.importDetailService.getById(id);
    return successResponse(data, ctx);
  }
  private async getAllImportDetail(ctx: Context) {
    const data = await this.importDetailService.getAll();
    return successResponse(data, ctx);
  }
  private async getImportDetailByImportId(ctx: Context) {
    const importId = ctx.query.importId;
    const data = await this.importDetailService.getByImportId(importId);
    return successResponse(data, ctx);
  }
  getRoutes(mdlFactory: MdlFactory) {
    const module = new Elysia({ prefix: "/admin" })
      .derive(mdlFactory.auth)
      .get("/renew", this.renewTokenAdmin.bind(this))
      .post("/signup-manager", this.signupManager.bind(this));
    const userRoutes = new Elysia({ prefix: "/user" })
      .derive(mdlFactory.auth)
      .put("/lock-user", this.lockUser.bind(this))
      .put("/restore-user", this.restoreUser.bind(this))
      .get("", this.getAllUser.bind(this))
      .get("/active", this.getAllActiveUser.bind(this))
      .get("/inactive", this.getAllInactiveUser.bind(this))
      .get("/shipper", this.getAllShipper.bind(this))
      .get("/manager", this.getAllManager.bind(this));
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
      .get("/search/sizetypeid", this.getSizeBySizeTypeId.bind(this))
      .get("/search/name", this.getSizeByNameAdmin.bind(this))
      .get("/search/sizetypename", this.getSizeBySizeTypeName.bind(this))
      .post("/create", this.createSize.bind(this))
      .put("/update", this.updateSize.bind(this))
      .put("/delete", this.deleteSize.bind(this))
      .put("/restore", this.restoreSize.bind(this));
    const sizeTypeRoutes = new Elysia({ prefix: "/sizetype" })
      .derive(mdlFactory.auth)
      .get("", this.getAllSizeType.bind(this))
      .get("/active", this.getAllActiveSizeType.bind(this))
      .get("/inactive", this.getAllInactiveSizeType.bind(this))
      .get("/search/id", this.getSizeTypeByIdAdmin.bind(this))
      .get("/search/name", this.getSizeTypeByNameAdmin.bind(this))
      .post("/create", this.createSizeType.bind(this))
      .put("/update", this.updateSizeType.bind(this))
      .put("/delete", this.deleteSizeType.bind(this))
      .put("/restore", this.restoreSizeType.bind(this));
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
      .get("/search", this.getAddressById.bind(this));
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
    const orderRoutes = new Elysia({ prefix: "/order" })
      .derive(mdlFactory.auth)
      .get("", this.getAllOrder.bind(this))
      .get("/detail-order", this.getOrderDetail.bind(this))
      .get("/order-processing", this.getAllOrderProcessing.bind(this))
      // .get("/order-shipped", this.getAllOrderShipped.bind(this))
      .get("/order-delivered", this.getAllOrderDelivered.bind(this))
      .get("/order-completed", this.getAllOrderCompleted.bind(this))
      .get("/order-cancelled", this.getAllOrderCancelled.bind(this))
      .get(
        "/order-processing/time",
        this.getAllOrderCreatedBetweenTime.bind(this)
      )
      // .get("/order-shipped/time", this.getAllOrderShippedBetweenTime.bind(this))
      .get(
        "/order-delivered/time",
        this.getAllOrderDeliveredBetweenTime.bind(this)
      )
      .get(
        "/order-completed/time",
        this.getAllOrderCompletedBetweenTime.bind(this)
      )
      .get("/search-by-name", this.getAllOrderByname.bind(this))
      .get("/search-by-orderid", this.getOrderByOrderId.bind(this))
      .get("/search-by-userid", this.getAllOrderByUserId.bind(this))
      // .get("/search-by-shipperid", this.getAllOrderByShipperId.bind(this))
      .put("/take-delivered", this.takeOrderToDelivered.bind(this))
      .put("/cancel-order", this.cancelOrder.bind(this));
    const statisticRoutes = new Elysia({ prefix: "/statistic" })
      .derive(mdlFactory.auth)
      .get("/general-statistic", this.getStatistic.bind(this))
      .get("/by-status", this.statisticByStatus.bind(this))
      .get("/by-time", this.statisticByTime.bind(this))
      .get("/top-selling", this.getTopSellingProductItem.bind(this))
      .get("/by-brand", this.getBrandStatistics.bind(this))
      .get("/by-cate", this.getCategoryStatistics.bind(this));
    const supplierRoutes = new Elysia({ prefix: "/supplier" })
      .derive(mdlFactory.auth)
      .get("", this.getAllSupplier.bind(this))
      .get("/active", this.getAllActiveSupplier.bind(this))
      .get("/inactive", this.getAllInactiveSupplier.bind(this))
      .get("/search/id", this.getSupplierByIdAdmin.bind(this))
      .get("/search/name", this.getSupplierByNameAdmin.bind(this))
      .post("/create", this.createSupplier.bind(this))
      .put("/update", this.updateSupplier.bind(this))
      .put("/delete", this.deleteSupplier.bind(this))
      .put("/restore", this.restoreSupplier.bind(this));
    const importRoutes = new Elysia({ prefix: "/import" })
      .derive(mdlFactory.auth)
      .post("/create", this.createImport.bind(this))
      .get("", this.getAllImport.bind(this))
      .get("/search/id", this.getImportById.bind(this))
      .get("/search/title", this.getImportByTitle.bind(this))
      .get("/search/time-range", this.getImportByTimeRange.bind(this));
    const importDetailRoutes = new Elysia({ prefix: "/import/import-detail" })
      .derive(mdlFactory.auth)
      .post("/create", this.createImportDetail.bind(this))
      .get("", this.getAllImportDetail.bind(this))
      .get("/search/id", this.getImportDetailById.bind(this))
      .get("/search/import-id", this.getImportDetailByImportId.bind(this));
    module.use(importDetailRoutes);
    module.use(importRoutes);
    module.use(supplierRoutes);
    module.use(statisticRoutes);
    module.use(orderRoutes);
    module.use(paymentRoutes);
    module.use(discountRoutes);
    module.use(addressRoutes);
    module.use(productItemRoutes);
    module.use(productRoutes);
    module.use(colorRoutes);
    module.use(sizeRoutes);
    module.use(sizeTypeRoutes);
    module.use(cateRoutes);
    module.use(brandRoutes);
    module.use(userRoutes);
    return module;
  }
}
