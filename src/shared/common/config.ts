import { StringValue } from "ms";
const appConfig = {
  db: {
    mongodbName: process.env.MONGODB_NAME,
    mongodbUser: process.env.MONGODB_USER,
    mongodbPassword: process.env.MONGODB_PASSWORD,
  },
  imagekit: {
    id: process.env.IMAGE_KIT_ID,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    endpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
    expired: process.env.IMAGE_KIT_EXPIRED,
  },
  jwt: {
    secretKey: process.env.SECRET_JWT,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
    resetPasswordTokenExpiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN as StringValue
  },
  google: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUrl: process.env.GOOGLE_REDIRECT_URL,
    smtpGoogleEmail: process.env.SMTP_GMAIL,
    smtpGooglePassword: process.env.SMTP_GMAIL_PASSWORD
  },
  app: {
    hashPasswordKey: process.env.SECRET_PASSWORD,
    hashRoleKey: process.env.SECRET_ROLE,
    port: process.env.APP_PORT,
    prefixApiUrl: process.env.PREFIX_API_URL as string,
    corsWhiteList: ["http://localhost:8080", "http://localhost:5173"],
    baseUrl: `${process.env.APP_URL}:${process.env.APP_PORT}`
  },
  GHN: {
    token: process.env.GHN_TOKEN,
    shopId: process.env.GHN_SHOP_ID,
    serviceId: process.env.GHN_SERVICE_ID,
  }
};

export default appConfig;
