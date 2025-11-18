import { StringValue } from "ms";
import { Paginated, Paging, TokenType } from "../../../shared/interface";
import {
  IAuthen,
  IChangePasswordForm,
  ILoginForm,
  IResetPasswordForm,
  ISignupForm,
  IUpdateProfileForm,
  IUpdateUserForm,
  IUserCondForm,
  User,
} from "../model";
import { AskLoginInput, LoginWithProviderInput } from "../model/oauth";
import { Order } from "../../order/model";
import { OrderDetail } from "../../orderdetail/model";

export interface IUserRepository {
  insert: (user: User) => Promise<User>;
  update: (id: string, form: IUpdateUserForm) => Promise<boolean>;
  findById: (id: string) => Promise<User | null>;
  findByCond: (id: IUserCondForm) => Promise<User | null>;
  list: (cond: IUserCondForm, paging: Paging) => Promise<Paginated<User>>;
  generateToken: (
    userId: string,
    type: TokenType,
    expiresIn: StringValue
  ) => Promise<string>;
  generateTokenAdmin: (
    userId: string,
    type: TokenType,
    expiresIn: StringValue
  ) => Promise<string>;
  generateTokenShipper: (
    userId: string,
    type: TokenType,
    expiresIn: StringValue
  ) => Promise<string>;
  generateTokenManager: (
    userId: string,
    type: TokenType,
    expiresIn: StringValue
  ) => Promise<string>;
}

export interface IUserService {
  login: (form: ILoginForm) => Promise<IAuthen>;
  loginWithGoogle: (code: string) => Promise<IAuthen>;
  signup: (form: ISignupForm) => Promise<IAuthen>;
  signupAdmin(form: ISignupForm): Promise<IAuthen>;
  signupShipper(form: ISignupForm): Promise<IAuthen>;
  signupManager(form: ISignupForm): Promise<IAuthen>;
  getProfile: (id: string) => Promise<User>;
  updateProfile: (id: string, form: IUpdateProfileForm) => Promise<User>;
  updateUser: (id: string, form: IUpdateUserForm) => Promise<User>;

  getAllUser(): Promise<User[]>;
  getAllActiveUser(): Promise<User[]>;
  getAllInactiveUser(): Promise<User[]>;
  getAllShipper(): Promise<User[]>;
  getAllManager(): Promise<User[]>;

  lockUser(userId: string): Promise<boolean>;
  restoreUser(userId: string): Promise<boolean>;
  renewToken: (oldRefreshToken: string) => Promise<IAuthen>;
  renewTokenAdmin: (oldRefreshToken: string) => Promise<IAuthen>;
  renewTokenShipper: (oldRefreshToken: string) => Promise<IAuthen>;
  renewTokenManager: (oldRefreshToken: string) => Promise<IAuthen>;
  logout: (refreshToken: string) => Promise<boolean>;
  sendEmailToResetPassword: (form: IResetPasswordForm) => Promise<string>;
  changePassword: (
    token: string,
    form: IChangePasswordForm
  ) => Promise<boolean>;
  requestLogin(form: AskLoginInput): Promise<string>;
  loginWithProvider(form: LoginWithProviderInput): Promise<IAuthen>;
  getAllOrdersByUserId: (userId: string) => Promise<Order[]>;
  getOrderDetailByOrderIdAndUserId: (
    id: string,
    userId: string
  ) => Promise<OrderDetail[] | null>;
  getAllOrderProcessingByUserId: (userId: string) => Promise<Order[]>;
  // getAllOrderShippedByUserId: (userId: string) => Promise<Order[]>;
  getAllOrderDeliveredByUserId: (userId: string) => Promise<Order[]>;
  getAllOrderCompletedByUserId: (userId: string) => Promise<Order[]>;
  getAllOrderCancelledByUserId: (userId: string) => Promise<Order[]>;
  takeOrderCompletedByUserId: (id: string, userId: string) => Promise<Order>;
  cancelOrderUser(userId: string, orderId: string): Promise<Order>;
}
