import { Context } from "elysia";
import { Paginated } from "../interface";

const successResponse = (data: any, ctx: Context) => {
  ctx.set.status = 200;
  return { data };
};

const paginatedResponse = (paginated: Paginated<any>, ctx: Context) => {
  ctx.set.status = 200;
  return { data: paginated };
};

export { paginatedResponse, successResponse };
