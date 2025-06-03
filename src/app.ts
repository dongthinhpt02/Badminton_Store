import Elysia from "elysia";
import appConfig from "./shared/common/config";
import cors from "@elysiajs/cors";
import { AppError, responseErr } from "./shared/utils/error";
import { helmet } from "elysia-helmet";
import swagger from "@elysiajs/swagger";
import { ElysiaWS } from "elysia/dist/ws";
import WebSocket from "ws";
import ws from 'elysia';


declare module "elysia" {
    interface Elysia {
      broadcastOrderUpdate: (data: any) => void;
    }
  }
  function buildApp() {
    let app = new Elysia({ aot: false });
    const connectedClients = new Set<ElysiaWS>();
  
    app.use(cors({ origin: appConfig.app.corsWhiteList }));
    app.use(helmet());
  
    app.error({ AppError }).onError((ctx) => {
      if (ctx.error instanceof Error) {
        return responseErr(ctx.error, ctx);
      }
      return responseErr(new Error("Unknown error"), ctx);
    });
  
    // app.ws('/ws/order', {
    //   open(ws) {
    //     connectedClients.add(ws);
    //     console.log('Client connected, total:', connectedClients.size);
    //   },
    //   close(ws) {
    //     connectedClients.delete(ws);
    //     console.log('Client disconnected, total:', connectedClients.size);
    //   },
    //   message(ws, message) {
    //     console.log('Received message:', message);
    //   }
    // });
  
    // app.decorate('broadcastOrderUpdate', (data: any) => {
    //   for (const client of connectedClients) {
    //     if (client.readyState === WebSocket.OPEN) {
    //       client.send(JSON.stringify(data));
    //     }
    //   }
    // });
  
    // console.log('broadcastOrderUpdate in app:', typeof app.broadcastOrderUpdate);
  

    return app;
  }
  
export default buildApp();
