import jwt from "jsonwebtoken";
import appConfig from "./config";
import { ITokenPayload } from "../interface";



async function generateToken({
  payload,
  options = {},
}: {
  payload: ITokenPayload;
  options?: jwt.SignOptions;
}) {
  return jwt.sign(payload, appConfig.jwt.secretKey as string, options);
}
  
async function signToken(payload: string | object | Buffer, pk: string = appConfig.jwt.secretKey as string, options: jwt.SignOptions = {}): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, pk, options, (error, token) => {
      if (error) {
        reject(new Error("Failed to sign token"));
      }
      resolve(token!);
    });
  });
}
async function verifyToken(token: string): Promise<ITokenPayload | null> {
  try {
    return jwt.verify(
      token,
      appConfig.jwt.secretKey as string
    ) as ITokenPayload;
  } catch (error) {
    return null;
  }
}

export default {
  generateToken,
  verifyToken,
  signToken
};
