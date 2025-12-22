import Elysia, { Context } from "elysia";
import {
  loginSchema,
  signupSchema,
  updateProfileSchema,
  resetPassowrdSchema,
  changePasswordSchema,
  updateUserSchema,
} from "../model";
import { IUserService } from "../interface";
import { successResponse } from "../../../shared/utils/response";
import { AuthContext } from "../../../shared/middleware";
import { MdlFactory, TokenType } from "../../../shared/interface";
import { ErrTokenInvalid } from "../../../shared/utils/error";
import { z } from "zod";
import passport, { Passport } from "passport";
import appConfig from "../../../shared/common/config";
import { OauthContext } from "../model/oauth";
import { sendResetPasswordEmail } from "../../../shared/utils/mailer";
import logger from "../../../shared/utils/logger";

export class HttpUserController {
  constructor(private readonly service: IUserService) {}

  private async login(ctx: Context) {
    const form = loginSchema.parse(ctx.body);
    const data = await this.service.login(form);

    return successResponse(data, ctx);
  }

  private async signup(ctx: Context) {
    try {
      const form = signupSchema.parse(ctx.body);
      const data = await this.service.signup(form);

      return successResponse(data, ctx);
    } catch (err) {
      // Xử lý lỗi Zod
      if (err instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: "Validation failed",
            details: err.errors,
          }),
          { status: 400 }
        );
      }
      throw err;
    }
  }

  private async signupAdmin(ctx: Context) {
    try {
      const form = signupSchema.parse(ctx.body);
      const data = await this.service.signupAdmin(form);

      return successResponse(data, ctx);
    } catch (err) {
      // Xử lý lỗi Zod
      if (err instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: "Validation failed",
            details: err.errors,
          }),
          { status: 400 }
        );
      }
      throw err;
    }
  }
  private async signupShipper(ctx: Context) {
    try {
      const form = signupSchema.parse(ctx.body);
      const data = await this.service.signupShipper(form);

      return successResponse(data, ctx);
    } catch (err) {
      // Xử lý lỗi Zod
      if (err instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: "Validation failed",
            details: err.errors,
          }),
          { status: 400 }
        );
      }
      throw err;
    }
  }

  private async sendTokenToEmail(ctx: Context) {
    const email = resetPassowrdSchema.parse(ctx.body);
    const data = await this.service.sendEmailToResetPassword(email);
    // const resetUrl = `${appConfig.app.baseUrl}/users/reset-password?token=${data}`;
    const resetUrl = `${appConfig.app.FEURL}/reset-password?token=${data}`;
    await sendResetPasswordEmail(email.email, resetUrl);
    return successResponse(data, ctx);
  }

  private async resetPassword(ctx: Context) {
    const token = ctx.query.token;
    logger.success(token);
    const form = changePasswordSchema.parse(ctx.body);
    const data = await this.service.changePassword(token, form);
    return successResponse(data, ctx);
  }

  private async getProfile(ctx: AuthContext) {
    const user_id = ctx.decoded.sub;
    const data = await this.service.getProfile(user_id);

    return successResponse(data, ctx);
  }

  private async updateProfile(ctx: AuthContext) {
    const user_id = ctx.decoded.sub;
    const form = updateProfileSchema.parse(ctx.body);
    const data = await this.service.updateProfile(user_id, form);

    return successResponse(data, ctx);
  }
  private async updateUser(ctx: AuthContext) {
    const user_id = ctx.decoded.sub;
    const form = updateUserSchema.parse(ctx.body);
    const data = await this.service.updateUser(user_id, form);
    return successResponse(data, ctx);
  }

  private async renewToken(ctx: AuthContext) {
    const token = ctx.token;
    if (ctx.decoded.type !== TokenType.RefreshToken)
      throw ErrTokenInvalid.withLog("Not the expected token");

    const data = await this.service.renewToken(token);

    return successResponse(data, ctx);
  }

  private async logout(ctx: AuthContext) {
    const token = ctx.token;
    if (ctx.decoded.type !== TokenType.RefreshToken)
      throw ErrTokenInvalid.withLog("Not the expected token");

    const data = await this.service.logout(token);

    return successResponse(data, ctx);
  }

  private async requestLogin(ctx: OauthContext) {
    const state = crypto.randomUUID();
    // Store context to verify
    ctx.store.login_state = state;
    const redirectUri = await this.service.requestLogin({
      provider: ctx.params.provider,
      state,
    });

    return successResponse({ url: redirectUri }, ctx);
  }

  private async loginWithProvider(ctx: OauthContext) {
    const profile = await this.service.loginWithProvider({
      provider: ctx.params.provider,
      form: ctx.body,
      login_state: ctx.store.login_state,
    });
    // Reset state
    ctx.store.login_state = "";
    return successResponse(profile, ctx);
  }

  private async getAllOrdersByUserId(ctx: AuthContext) {
    const userId = ctx.decoded.sub;
    const orders = await this.service.getAllOrdersByUserId(userId);
    return successResponse(orders, ctx);
  }
  private async getOrderByIdAndUserId(ctx: AuthContext) {
    const userId = ctx.decoded.sub;
    const id = ctx.query.id;
    const order = await this.service.getOrderDetailByOrderIdAndUserId(
      id,
      userId
    );
    return successResponse(order, ctx);
  }
  private async getAllOrderProcessingByUserId(ctx: AuthContext) {
    const userId = ctx.decoded.sub;
    const orders = await this.service.getAllOrderProcessingByUserId(userId);
    return successResponse(orders, ctx);
  }
  // private async getAllOrderShippedByUserId(ctx: AuthContext) {
  //   const userId = ctx.decoded.sub;
  //   const orders = await this.service.getAllOrderShippedByUserId(userId);
  //   return successResponse(orders, ctx);
  // }
  private async getAllOrderDeliveredByUserId(ctx: AuthContext) {
    const userId = ctx.decoded.sub;
    const orders = await this.service.getAllOrderDeliveredByUserId(userId);
    return successResponse(orders, ctx);
  }
  private async getAllOrderCompletedByUserId(ctx: AuthContext) {
    const userId = ctx.decoded.sub;
    const orders = await this.service.getAllOrderCompletedByUserId(userId);
    return successResponse(orders, ctx);
  }
  private async getAllOrderCancelledByUserId(ctx: AuthContext) {
    const userId = ctx.decoded.sub;
    const orders = await this.service.getAllOrderCancelledByUserId(userId);
    return successResponse(orders, ctx);
  }
  private async takeOrderCompletedByUserId(ctx: AuthContext) {
    const userId = ctx.decoded.sub;
    const id = ctx.query.id;
    const order = await this.service.takeOrderCompletedByUserId(id, userId);
    return successResponse(order, ctx);
  }
  private async cancelOrderUser(ctx: AuthContext) {
    const userId = ctx.decoded.sub;
    const id = ctx.query.id;
    const order = await this.service.cancelOrderUser(id, userId);
    return successResponse(order, ctx);
  }

  getRoutes(mdlFactory: MdlFactory) {
    const module = new Elysia();
    const usersRoute = new Elysia({ prefix: "/users" })
      .post("/login", this.login.bind(this))
      .post("/signup", this.signup.bind(this))
      .post("/request-reset-password", this.sendTokenToEmail.bind(this))
      .post("/reset-password", this.resetPassword.bind(this))

      // auth middleware
      .derive(mdlFactory.auth)
      .get("/", this.getProfile.bind(this))
      .put("/update-profile", this.updateProfile.bind(this))
      .put("/update-user", this.updateUser.bind(this))
      .get("/renew", this.renewToken.bind(this))
      .delete("/logout", this.logout.bind(this));
    const oauthRoute = new Elysia({ prefix: "/oauth" })
      .state("login_state", "")
      .get("/request/:provider", this.requestLogin.bind(this))
      .post("/login/:provider", this.loginWithProvider.bind(this));
    const adminRoute = new Elysia({ prefix: "/admin" }).post(
      "/signup",
      this.signupAdmin.bind(this)
    );
    const shipperRoute = new Elysia({ prefix: "/shipper" }).post(
      "/signup",
      this.signupShipper.bind(this)
    );
    const orderRoute = new Elysia({ prefix: "/order" })
      .derive(mdlFactory.auth)
      .get("/all-order", this.getAllOrdersByUserId.bind(this))
      .get("/detail-order", this.getOrderByIdAndUserId.bind(this))
      .get(
        "/all-order-processing",
        this.getAllOrderProcessingByUserId.bind(this)
      )
      // .get("/all-order-shipped", this.getAllOrderShippedByUserId.bind(this))
      .get("/all-order-delivered", this.getAllOrderDeliveredByUserId.bind(this))
      .get("/all-order-completed", this.getAllOrderCompletedByUserId.bind(this))
      .get("/all-order-cancelled", this.getAllOrderCancelledByUserId.bind(this))
      .post("/take-order-completed", this.takeOrderCompletedByUserId.bind(this))
      .put("/cancel-order", this.cancelOrderUser.bind(this));
    module.use(orderRoute);
    module.use(shipperRoute);
    module.use(usersRoute);
    module.use(oauthRoute);
    module.use(adminRoute);
    return module;
  }
}
