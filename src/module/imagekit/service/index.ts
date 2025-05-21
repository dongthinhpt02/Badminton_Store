import { UploadOptions } from 'imagekit/dist/libs/interfaces';
import jwt from "../../../shared/common/jwt";
import appConfig from '../../../shared/common/config';
import { StringValue } from 'ms';
import { IImageKitService } from '../interface';

type tokenPayload = { uploadPayload: Omit<UploadOptions, 'file' | 'token'> };

// Hàm tạo token JWT
export class ImagekitService implements IImageKitService {
    async generateImageToken(payload: tokenPayload): Promise<string | null> {
        try {
            const token = await jwt.signToken(
                payload.uploadPayload,  // Truyền đúng thuộc tính 'uploadPayload' từ payload
                appConfig.imagekit.privateKey,  // Private key từ config
                {
                    expiresIn: appConfig.imagekit.expired as StringValue,  // Thời gian hết hạn từ config
                    algorithm: 'HS256',
                    header: {
                        alg: 'HS256',
                        typ: 'JWT',
                        kid: appConfig.imagekit.publicKey,  // Public key từ config
                    },
                }
            );
            return token;
        } catch (error) {
            console.error("Error generating image token:", error);
            return null;
        }
    }
}
