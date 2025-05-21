import { ITokenPayload, MdlFactory, UserRole } from "./../interface/index";
import { type Context } from "elysia";
import jwt from "../common/jwt";
import { ErrTokenInvalid } from "../utils/error";

export interface AuthContext extends Context {
  decoded: ITokenPayload;
  token: string;
}

async function decodeToken(ctx: Context) {
  try {
    const token = ctx.headers["authorization"]?.replace("Bearer", "").trim();

    if (!token) {
      throw ErrTokenInvalid.withLog("Token is missing");
    }

    const decoded = await jwt.verifyToken(token);
    if (!decoded) throw ErrTokenInvalid.withLog("Token parse failed");

    return {
      decoded,
      token,
    };
  } catch (error) {
    throw error;
  }
}
function setupAdminMiddlewares(): MdlFactory {
  async function authMiddleware(ctx: Context) {
    const { decoded, token } = await decodeToken(ctx);

    if (decoded.role !== UserRole.ADMIN) {
        console.log(decoded);
        console.log(decoded.role);
      throw ErrTokenInvalid.withLog(`Role ${decoded.role} not allowed`);
    }
    return { decoded, token };
  }
  return {
    auth: authMiddleware,
    optAuth: authMiddleware,
  };
}
export default setupAdminMiddlewares;