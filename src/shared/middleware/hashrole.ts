import { StringValue } from "ms";
import appConfig from "../common/config";
import { hashRole, sha256 } from "../common/hash";
import { ITokenPayload, TokenType, UserRole } from "../interface";
import jwt from "jsonwebtoken";


const DEFINE_HASH = {
    Gura: hashRole("admin"),
    Mumei: hashRole("manager"),
    Bijou: hashRole("user"),
    Gigi: hashRole("shipper"),
}

//toi admin thi nho lay thang nay ra
async function generateTokenByRole(userId: string,
    type: TokenType,
    expiresIn: StringValue) {
    return jwt.sign(
        {
            sub: userId,
            role: UserRole.ADMIN,
            type,
        } as ITokenPayload,
        DEFINE_HASH['Gura'] as string,
        { expiresIn: expiresIn ?? appConfig.jwt.accessTokenExpiresIn }
    );
}
async function getRoleAdmin(token: string) {
    const { sub, key: hash, type } = jwt.verify(token, DEFINE_HASH['Gura']) as ITokenPayload;

    let role = '';

    for (const [key, value] of Object.entries(DEFINE_HASH)) {
        if (value === hash) {
            role = key;
            break;
        }
    }

    return role;
}
export default {
    generateTokenByRole,
    getRoleAdmin,
    hashRole,
    DEFINE_HASH,
};