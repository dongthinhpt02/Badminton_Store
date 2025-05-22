import appConfig from "../../../shared/common/config";
import { hashPassword } from "../../../shared/common/hash";
import { mongodbService } from "../../../shared/common/mongodb";
import { TokenType, ITokenPayload, UserRole } from "../../../shared/interface";
import { AppError, ErrInternalServer, ErrInvalidRequest } from "../../../shared/utils/error";
import { IUserService } from "../interface";
import {
    IAuthen,
    ILoginForm,
    ISignupForm,
    userSchema,
    User,
    IUpdateProfileForm,
    IUpdateUserForm,
    signupSchema,
    Status,
    IResetPasswordForm,
    IChangePasswordForm,
    updateUserSchema,
    updateProfileSchema,

} from "../model";
import { ErrEmailAndUsernameExisted, ErrEmailNotFound, ErrInvalidEmailAndPassword } from "../model/error";
import { MongodbUserRepository } from "./mongodb";
import jwt from "../../../shared/common/jwt";
import { StringValue } from "ms";
import { ObjectId } from "mongodb";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { TokenRequestResult } from '@oslojs/oauth2';
import { AskLoginInput, LoginWithGoogleInput, LoginWithProviderInput } from "../model/oauth";
import { cartSchema } from "../../cart/model";
import { ImagekitService } from "../../imagekit/service";

const googleOauthClient = new google.auth.OAuth2({
    clientId: appConfig.google.googleClientId,
    clientSecret: appConfig.google.googleClientSecret,
    redirectUri: 'http://localhost:8080/users/google/callback',
});

export class UserService implements IUserService {
    constructor(private readonly repository: MongodbUserRepository,
        private readonly imageKitService: ImagekitService,
    ) { }

    async login(form: ILoginForm): Promise<IAuthen> {
        const user = await this.repository.findByCond({
            ...form,
            password: hashPassword(form.password),
        });
        if (!user)
            throw AppError.from(ErrInvalidEmailAndPassword, 400).withLog(
                "Incorrect login information");

        if (user.status !== Status.ACTIVE)
            throw AppError.from(ErrInvalidEmailAndPassword, 400).withLog(
                "Account is not active, please contact admin");

        if (user.role === UserRole.ADMIN) {
            const [access_token, refresh_token] = await Promise.all([
                this.repository.generateTokenAdmin(
                    user._id.toString(),
                    TokenType.AccessToken,
                    appConfig.jwt.accessTokenExpiresIn),
                this.repository.generateTokenAdmin(
                    user._id.toString(),
                    TokenType.RefreshToken,
                    appConfig.jwt.refreshTokenExpiresIn
                ),
            ]);
            // Add new refresh token to db
            await mongodbService.refreshTokens.insertOne({ token: refresh_token });
            return {
                access_token,
                refresh_token,
            };
        }
        const cartExisting = await mongodbService.cart.findOne({ userId: user._id });
        if (!cartExisting) {
            const newCart = {
                _id: new ObjectId(),
                userId: user._id,
                totalPrice: 0,
                totalQuantity: 0,
            };
            await mongodbService.cart.insertOne(newCart);
        }

        // Generate token
        const [access_token, refresh_token] = await Promise.all([
            this.repository.generateToken(
                user._id.toString(),
                TokenType.AccessToken,
                appConfig.jwt.accessTokenExpiresIn),
            this.repository.generateToken(
                user._id.toString(),
                TokenType.RefreshToken,
                appConfig.jwt.refreshTokenExpiresIn
            ),
        ]);
        // Add new refresh token to db
        await mongodbService.refreshTokens.insertOne({ token: refresh_token });
        return {
            access_token,
            refresh_token,
        };
    }
    async signup(form: ISignupForm): Promise<IAuthen> {
        // const newUser = userSchema.parse(form);
        // const user = await this.repository.insert(newUser);

        const newUser = signupSchema.parse(form);

        // Check existing user
        const existingUser = await mongodbService.users.findOne({
            $or: [{ email: newUser.email }, { username: newUser.username }]
        });
        if (existingUser)
            throw AppError.from(ErrEmailAndUsernameExisted, 400).withLog(
                "Email or username already exists"
            );
        // Hash password
        const hashedPassword = hashPassword(newUser.password);

        // Build user object
        const userToInsert: User = {
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            password: hashedPassword,
            _id: new ObjectId(),
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
            restored_at: null,
            status: Status.ACTIVE,
            role: UserRole.USER, // Set default role
            email_verify_token: null,
            forgot_password_token: null,
            bio: null,
            avatar: null,
        };

        const user = await this.repository.insert(userToInsert);

        // Generate token
        const [access_token, refresh_token] = await Promise.all([
            this.repository.generateToken(
                user._id.toString()
                , TokenType.AccessToken,
                appConfig.jwt.accessTokenExpiresIn),
            this.repository.generateToken(
                user._id.toString(),
                TokenType.RefreshToken,
                appConfig.jwt.refreshTokenExpiresIn
            ),
        ]);

        const newCart = {
            _id: new ObjectId(),
            userId: user._id,
            totalPrice: 0,
            totalQuantity: 0,
        }

        await mongodbService.cart.insertOne(newCart);
        // Add new refresh token to db
        await mongodbService.refreshTokens.insertOne({ token: refresh_token });

        return {
            access_token,
            refresh_token,
        };
    }
    async sendEmailToResetPassword(form: IResetPasswordForm): Promise<string> {
        const user = await this.repository.findByCond({
            email: form.email,
        });
        if (!user)
            throw AppError.from(ErrEmailNotFound, 400).withLog(
                "Email not found"
            );
        if (user.forgot_password_token) {
            return user.forgot_password_token;
        }
        const token = await this.repository.generateToken(
            user._id.toString(),
            TokenType.ForgotPasswordToken,
            appConfig.jwt.resetPasswordTokenExpiresIn
        );
        await mongodbService.users.updateOne(
            { _id: user._id },
            { $set: { forgot_password_token: token } }
        );
        return token;
    }
    async changePassword(token: string, form : IChangePasswordForm): Promise<boolean> {
        const find = await mongodbService.users.findOne({forgot_password_token: token});
        if (!find) {
            return false;
        }
        console.log(find);
        const result = await mongodbService.users.updateOne(
            { forgot_password_token: token },
            {
                $set:
                {
                    forgot_password_token: null,
                    password: hashPassword(form.password)
                }
            }
        )
        return true;
    }
    async lockUser(userId: string): Promise<boolean> {
        const find = await mongodbService.users.findOne({ _id: new ObjectId(userId) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.users.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { status: Status.INACTIVE } }
        )
        return true;
    }
    async restoreUser(userId: string): Promise<boolean> {
        const find = await mongodbService.users.findOne({ _id: new ObjectId(userId) });
        if (!find) {
            return false;
        }
        const result = await mongodbService.users.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { status: Status.ACTIVE } }
        )
        return true;
    }
    async signupAdmin(form: ISignupForm): Promise<IAuthen> {
        // const newUser = userSchema.parse(form);
        // const user = await this.repository.insert(newUser);

        const newUser = signupSchema.parse(form);

        // Check existing user
        const existingUser = await mongodbService.users.findOne({
            $or: [{ email: newUser.email }, { username: newUser.username }]
        });
        if (existingUser)
            throw AppError.from(ErrEmailAndUsernameExisted, 400).withLog(
                "Email or username already exists"
            );
        // Hash password
        const hashedPassword = hashPassword(newUser.password);

        // Build user object
        const userToInsert: User = {
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            password: hashedPassword,
            _id: new ObjectId(),
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
            restored_at: null,
            status: Status.ACTIVE,
            role: UserRole.ADMIN, // Set default role
            email_verify_token: null,
            forgot_password_token: null,
            bio: null,
            avatar: null,
        };

        const user = await this.repository.insert(userToInsert);

        // Generate token
        const [access_token, refresh_token] = await Promise.all([
            this.repository.generateToken(
                user._id.toString()
                , TokenType.AccessToken,
                appConfig.jwt.accessTokenExpiresIn),
            this.repository.generateToken(
                user._id.toString(),
                TokenType.RefreshToken,
                appConfig.jwt.refreshTokenExpiresIn
            ),
        ]);

        const newCart = {
            _id: new ObjectId(),
            userId: user._id,
            totalPrice: 0,
            totalQuantity: 0,
        }

        await mongodbService.cart.insertOne(newCart);
        // Add new refresh token to db
        await mongodbService.refreshTokens.insertOne({ token: refresh_token });

        return {
            access_token,
            refresh_token,
        };
    }

    async signupManager(form: ISignupForm): Promise<IAuthen> {
        // const newUser = userSchema.parse(form);
        // const user = await this.repository.insert(newUser);

        const newUser = signupSchema.parse(form);

        // Check existing user
        const existingUser = await mongodbService.users.findOne({
            $or: [{ email: newUser.email }, { username: newUser.username }]
        });
        if (existingUser)
            throw AppError.from(ErrEmailAndUsernameExisted, 400).withLog(
                "Email or username already exists"
            );
        // Hash password
        const hashedPassword = hashPassword(newUser.password);

        // Build user object
        const userToInsert: User = {
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            password: hashedPassword,
            _id: new ObjectId(),
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
            restored_at: null,
            status: Status.ACTIVE,
            role: UserRole.MANAGER, // Set default role
            email_verify_token: null,
            forgot_password_token: null,
            bio: null,
            avatar: null,
        };

        const user = await this.repository.insert(userToInsert);

        // Generate token
        const [access_token, refresh_token] = await Promise.all([
            this.repository.generateToken(
                user._id.toString()
                , TokenType.AccessToken,
                appConfig.jwt.accessTokenExpiresIn),
            this.repository.generateToken(
                user._id.toString(),
                TokenType.RefreshToken,
                appConfig.jwt.refreshTokenExpiresIn
            ),
        ]);

        // Add new refresh token to db
        await mongodbService.refreshTokens.insertOne({ token: refresh_token });

        return {
            access_token,
            refresh_token,
        };
    }

    async signupShipper(form: ISignupForm): Promise<IAuthen> {
        // const newUser = userSchema.parse(form);
        // const user = await this.repository.insert(newUser);

        const newUser = signupSchema.parse(form);

        // Check existing user
        const existingUser = await mongodbService.users.findOne({
            $or: [{ email: newUser.email }, { username: newUser.username }]
        });
        if (existingUser)
            throw AppError.from(ErrEmailAndUsernameExisted, 400).withLog(
                "Email or username already exists"
            );
        // Hash password
        const hashedPassword = hashPassword(newUser.password);

        // Build user object
        const userToInsert: User = {
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            password: hashedPassword,
            _id: new ObjectId(),
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
            restored_at: null,
            status: Status.ACTIVE,
            role: UserRole.SHIPPER, 
            email_verify_token: null,
            forgot_password_token: null,
            bio: null,
            avatar: null,
        };

        const user = await this.repository.insert(userToInsert);

        // Generate token
        const [access_token, refresh_token] = await Promise.all([
            this.repository.generateToken(
                user._id.toString()
                , TokenType.AccessToken,
                appConfig.jwt.accessTokenExpiresIn),
            this.repository.generateToken(
                user._id.toString(),
                TokenType.RefreshToken,
                appConfig.jwt.refreshTokenExpiresIn
            ),
        ]);

        // Add new refresh token to db
        await mongodbService.refreshTokens.insertOne({ token: refresh_token });

        return {
            access_token,
            refresh_token,
        };
    }


    async getProfile(id: string): Promise<User> {
        const user = await this.repository.findById(id);
        return user as User;
    }
    async updateProfile(id: string, form: IUpdateProfileForm): Promise<User> {
        const updatedUser = updateProfileSchema.parse(form);
        await this.repository.update(id, updatedUser);
        const user = await this.repository.findById(id);
        return user as User;
    }
    async updateUser(id: string, form: IUpdateUserForm): Promise<User> {
        const updatedUser = updateUserSchema.parse(form);
        await this.repository.update(id, updatedUser);
        const user = await this.repository.findById(id);
        return user as User;
    }
    async renewToken(oldRefreshToken: string): Promise<IAuthen> {
        const decoded = (await jwt.verifyToken(oldRefreshToken)) as ITokenPayload;

        const remainingTime = decoded.exp! - Math.floor(Date.now() / 1000);

        // Create new token
        const [access_token, refresh_token] = await Promise.all([
            this.repository.generateToken(
                decoded.sub,
                TokenType.AccessToken,
                appConfig.jwt.accessTokenExpiresIn as StringValue),
            this.repository.generateToken(
                decoded.sub,
                TokenType.RefreshToken,
                appConfig.jwt.refreshTokenExpiresIn as StringValue
            ),
        ]);

        // Add new refresh token to db
        await mongodbService.refreshTokens.insertOne({ token: refresh_token });
        // Remove old token from db
        await mongodbService.refreshTokens.deleteOne({ token: oldRefreshToken });
        return {
            access_token,
            refresh_token,
        };
    }
    async renewTokenAdmin(oldRefreshToken: string): Promise<IAuthen> {
        const decoded = (await jwt.verifyToken(oldRefreshToken)) as ITokenPayload;

        const remainingTime = decoded.exp! - Math.floor(Date.now() / 1000);

        // Create new token
        const [access_token, refresh_token] = await Promise.all([
            this.repository.generateTokenAdmin(
                decoded.sub,
                TokenType.AccessToken,
                appConfig.jwt.accessTokenExpiresIn as StringValue),
            this.repository.generateTokenAdmin(
                decoded.sub,
                TokenType.RefreshToken,
                appConfig.jwt.refreshTokenExpiresIn as StringValue
            ),
        ]);

        // Add new refresh token to db
        await mongodbService.refreshTokens.insertOne({ token: refresh_token });
        // Remove old token from db
        await mongodbService.refreshTokens.deleteOne({ token: oldRefreshToken });
        return {
            access_token,
            refresh_token,
        };
    }
    async logout(refreshToken: string): Promise<boolean> {
        // Remove token from db
        await mongodbService.refreshTokens.deleteOne({ token: refreshToken });
        return true;
    }




    async loginWithGoogle(code: string): Promise<IAuthen> {
        // Đổi code sang access token từ Google
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code: code,
                client_id: appConfig.google.googleClientId!,
                client_secret: appConfig.google.googleClientSecret!,
                redirect_uri: appConfig.google.googleRedirectUrl!,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenRes.json();
        const access_token = tokenData.access_token;

        // Lấy user info từ Google
        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const googleUser = await userRes.json();
        const { name, email, picture } = googleUser;

        // Kiểm tra user đã tồn tại chưa
        let user = await this.repository.findByCond({ email });

        if (!user) {
            // Nếu chưa, tạo user mới
            const newUser: User = {
                username: email.split("@")[0], // tạo username từ email
                fullname: name,
                email,
                password: "", // không cần mật khẩu
                _id: new ObjectId(),
                created_at: new Date(),
                updated_at: null,
                deleted_at: null,
                restored_at: null,
                status: Status.ACTIVE,
                role: UserRole.USER,
                email_verify_token: null,
                forgot_password_token: null,
                bio: null,
                avatar: picture,
            };

            user = await this.repository.insert(newUser);
        }

        // Tạo token
        const [accessToken, refreshToken] = await Promise.all([
            this.repository.generateToken(
                user._id.toString(),
                TokenType.AccessToken,
                appConfig.jwt.accessTokenExpiresIn),
            this.repository.generateToken(
                user._id.toString(),
                TokenType.RefreshToken,
                appConfig.jwt.refreshTokenExpiresIn),
        ]);



        await mongodbService.refreshTokens.insertOne({ token: refreshToken });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
    // ============== Oauth =============
    // Request with oauth
    private async requestGoogle(state: string): Promise<string> {
        const scope = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ]; // https://developers.google.com/identity/protocols/oauth2/scopes?hl=vi
        const url = googleOauthClient.generateAuthUrl({
            scope,
            state,
            response_type: 'code',
            include_granted_scopes: true,
        });
        return url;
    }

    // Login with oauth
    async loginGoogle({ code, state, login_state }: LoginWithGoogleInput): Promise<IAuthen> {
        if (!code) {
            throw ErrInvalidRequest.withMessage('Code mismatch');
        } else if (!state || state !== login_state) {
            throw ErrInvalidRequest.withMessage('State mismatch. Possible CSRF attack');
        }

        // Get response with code
        const { res } = await googleOauthClient.getToken(code);

        // Parse response
        const result = new TokenRequestResult(res?.data);
        const ggResp = await google.oauth2('v2').userinfo.get({ oauth_token: result.accessToken() });
        // Check exist with email
        const user = await this.repository.findByCond({ email: ggResp.data.email as string });
        if (user) {
            // If exist => return this user
            const [accessToken, refreshToken] = await Promise.all([
                this.repository.generateToken(
                    user._id.toString(),
                    TokenType.AccessToken,
                    appConfig.jwt.accessTokenExpiresIn),
                this.repository.generateToken(
                    user._id.toString(),
                    TokenType.RefreshToken,
                    appConfig.jwt.refreshTokenExpiresIn),
            ]);
            await mongodbService.refreshTokens.insertOne({ token: refreshToken });
            const newCart = {
                _id: new ObjectId(),
                userId: user._id,
                totalPrice: 0,
                totalQuantity: 0,
            }

            await mongodbService.cart.insertOne(newCart);
            return {
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        } else {
            // Else => signup user
            const signupResp = await this.signup({
                email: ggResp.data.email as string,
                fullname: ggResp.data.name as string,
                username: ggResp.data.id as string,
                password: hashPassword(crypto.randomUUID()),
            });
            return signupResp;
        }
    }

    loginWithProvider({ provider, form, login_state }: LoginWithProviderInput): Promise<IAuthen> {
        const strategies: { [key in AskLoginInput['provider']]: (f: any) => Promise<IAuthen> } = {
            google: this.loginGoogle.bind(this), // assign UserService.loginGoogle to strategies[google], because 'this' using inside strategies object
        };
        if (provider in strategies) {
            return strategies[provider]({ ...form, login_state });
        } else {
            throw ErrInvalidRequest.withLog('Invalid provider');
        }
    }
    requestLogin({ provider, state }: AskLoginInput): Promise<string> {
        const strategies: { [key in AskLoginInput['provider']]: (s: string) => Promise<string> } = {
            google: this.requestGoogle,
        };

        if (provider in strategies) {
            return strategies[provider](state);
        } else {
            throw ErrInvalidRequest.withLog('Invalid provider');
        }
    }
}

