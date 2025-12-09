// import { UploadOptions } from 'imagekit/dist/libs/interfaces';
// import jwt from "../../../shared/common/jwt";
// import appConfig from '../../../shared/common/config';
// import { StringValue } from 'ms';
// import { IImageKitService } from '../interface';

// type tokenPayload = { uploadPayload: Omit<UploadOptions, 'file' | 'token'> };

// // Hàm tạo token JWT
// export class ImagekitService implements IImageKitService {
//     async generateImageToken(payload: tokenPayload): Promise<string | null> {
//         try {
//             const token = await jwt.signToken(
//                 payload.uploadPayload,  // Truyền đúng thuộc tính 'uploadPayload' từ payload
//                 appConfig.imagekit.privateKey,  // Private key từ config
//                 {
//                     expiresIn: appConfig.imagekit.expired as StringValue,  // Thời gian hết hạn từ config
//                     algorithm: 'HS256',
//                     header: {
//                         alg: 'HS256',
//                         typ: 'JWT',
//                         kid: appConfig.imagekit.publicKey,  // Public key từ config
//                     },
//                 }
//             );
//             return token;
//         } catch (error) {
//             console.error("Error generating image token:", error);
//             return null;
//         }
//     }
// }

import crypto from "crypto";
import appConfig from "../../../shared/common/config";

export class ImagekitService {
  async generateImageToken() {
    try {
      const privateKey = appConfig.imagekit.privateKey;
      if (!privateKey) {
        throw new Error("Missing IMAGEKIT_PRIVATE_KEY in config");
      }

      const token = crypto.randomBytes(16).toString("hex");
      const expire = Math.floor(Date.now() / 1000) + 600;

      const signature = crypto
        .createHmac("sha1", privateKey)
        .update(token + expire)
        .digest("hex");

      return { token, expire, signature };
    } catch (e) {
      console.error("Error generating image token:", e);
      return null;
    }
  }
}
