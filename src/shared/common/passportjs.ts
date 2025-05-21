// // shared/common/passport.ts
// import passport from "passport";
// import { Strategy as GoogleStrategy,  } from "passport-google-oauth20";
// import appConfig from "./config";



// passport.use(new GoogleStrategy({
//     clientID: appConfig.google.googleClientId!,
//     clientSecret: appConfig.google.googleClientSecret!,
//     callbackURL: appConfig.google.googleRedirectUrl!,
//     scope: ['profile', 'email'],
//   },
//   async validate(accessToken : string, refreshToken : string, profile : any, done : VerifyCallback) {
    
//   }
// ));

// passport.serializeUser((user, done) => {
//     done(null, user);
// }
// );
// passport.deserializeUser((payload : any, done) => {
//     done(null, payload);
// }
// );
// export default passport;
