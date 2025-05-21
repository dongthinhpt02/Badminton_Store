import { Admin } from "mongodb";
import { Brand } from "../../brand/model";
import { TokenType } from "../../../shared/interface";
import { StringValue } from "ms";
import { IUpdateUserForm, User } from "../../user/model";

export interface IAdminRepository {
    generateTokenByRole: (
        userId: string,
        type: TokenType,
        expiresIn: StringValue 
      ) => Promise<string>; 
    update: (id: string, form: IUpdateUserForm) => Promise<User | null>;
}
export interface IAdminService {
    update: (id: string, form: IUpdateUserForm) => Promise<User | null>;
}