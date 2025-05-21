    import Elysia from "elysia";
    import appConfig from "./shared/common/config";
    import cors from "@elysiajs/cors";
    import { AppError, responseErr } from "./shared/utils/error";
    import { helmet } from "elysia-helmet";
    import swagger from "@elysiajs/swagger";


    function buildApp() {
        const app = new Elysia({ aot: false});

        app.use(cors({ origin: appConfig.app.corsWhiteList }));
        app.use(helmet());

    

        app.error({ AppError }).onError((ctx) => {
            if (ctx.error instanceof Error) {
                return responseErr(ctx.error, ctx);
            }
            return responseErr(new Error("Unknown error"), ctx);
        });

        return app;

    }
    export default buildApp();
