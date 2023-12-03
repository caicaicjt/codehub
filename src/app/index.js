const Koa = require("koa");
const bodyparser = require("koa-bodyparser");

const errorHandler = require("./errorHandler");
const useRoutes = require("../router");

const app = new Koa();

app.use(bodyparser());
//将userRouter注册成中间件
// app.use(userRouter.routes());
//用于判断某一个method是否支持（我们是否实现了该请求方法）
// app.use(userRouter.allowedMethods());
//动态注册路由
useRoutes(app);

app.on("error", errorHandler);

module.exports = app;
