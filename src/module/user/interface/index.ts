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
import { AskLoginInput, LoginWithProviderInput } from '../model/oauth';

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
}

export interface IUserService {
  login: (form: ILoginForm) => Promise<IAuthen>;
  loginWithGoogle: (code : string) => Promise<IAuthen>;
  signup: (form: ISignupForm) => Promise<IAuthen>;
  signupAdmin (form: ISignupForm) : Promise<IAuthen>;
  getProfile: (id: string) => Promise<User>;
  updateProfile: (id: string, form: IUpdateProfileForm) => Promise<User>;
  updateUser : (id: string, form: IUpdateUserForm) => Promise<User>;
  renewToken: (oldRefreshToken: string) => Promise<IAuthen>;
  renewTokenAdmin: (oldRefreshToken: string) => Promise<IAuthen>;
  logout: (refreshToken: string) => Promise<boolean>;
  sendEmailToResetPassword : (form: IResetPasswordForm) => Promise<string>;
  changePassword : (token: string, form : IChangePasswordForm) => Promise<boolean>;
  requestLogin(form: AskLoginInput): Promise<string>;
  loginWithProvider(form: LoginWithProviderInput): Promise<IAuthen>;

}
