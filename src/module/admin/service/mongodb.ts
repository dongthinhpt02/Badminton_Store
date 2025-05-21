import { StringValue } from "ms";
import { ITokenPayload, TokenType, UserRole } from "../../../shared/interface";
import jwt from "../../../shared/common/jwt";
import appConfig from "../../../shared/common/config";
import { sha256 } from "../../../shared/common/hash";
import { IAdminRepository } from "../interface";
import { Admin, ObjectId } from "mongodb";
import { mongodbService } from "../../../shared/common/mongodb";
import { IUpdateUserForm, User } from "../../user/model";

export class MongodbAdminRepository implements IAdminRepository {
    async generateTokenByRole(
        userId: string,
        type: TokenType,
        expiresIn: StringValue
      ): Promise<string> {
        return jwt.generateToken({
          payload: { sub: userId, role: UserRole.ADMIN, type },
          options: { expiresIn: expiresIn ?? appConfig.jwt.accessTokenExpiresIn },
        });
    }
   async update (id: string, form: IUpdateUserForm) : Promise<User | null>{
        const result = await mongodbService.users.updateOne(
                    {
                        _id: new ObjectId(id),
                    },
                    { $set: form }
                );
                if (result.modifiedCount === 0) {
                    return null;
                }
                const updated = await mongodbService.users.findOne({ _id: new ObjectId(id) });
            return updated as User;
   }
    
}