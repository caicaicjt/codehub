const jwt = require("jsonwebtoken");

const errorTypes = require("../constants/error.type");
const userService = require("../service/user.service");
const authService = require("../service/auth.service");
const md5password = require("../utils/password-handle");
const { PUBLIC_KEY } = require("../app/config");

const verifyLogin = async (ctx, next) => {
  //获取用户信息
  const { name, password } = ctx.request.body;
  //1.判断用户名和密码是否为空
  if (!name || !password) {
    const err = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", err, ctx);
  }
  //2.判断用户名是否存在
  const result = await userService.getUserByName(name);
  const user = result[0];
  if (!user) {
    const err = new Error(errorTypes.USERNAME_DOSE_NOT_EXISTS);
    return ctx.app.emit("error", err, ctx);
  }
  //3.判断密码是否和数据库中一致(加密后)
  if (md5password(password) != user.password) {
    const err = new Error(errorTypes.PASSWORD_IS_INCORRECT);
    return ctx.app.emit("error", err, ctx);
  }

  ctx.user = user;
  await next();
};

const verifyAuth = async (ctx, next) => {
  console.log("验证token");
  //1.获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const err = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit("error", err, ctx);
  }
  const token = authorization.replace("Bearer ", "");

  //2.验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = result;
    await next();
  } catch (error) {
    const err = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit("error", err, ctx);
  }
};

const verifyPermission = async (ctx, next) => {
  console.log("验证修改动态权限");
  //1.获取参数
  const [tableKey] = Object.keys(ctx.params);
  const tableName = tableKey.replace("Id", "");
  const targetId = ctx.params[tableKey];
  const { id } = ctx.user;
  //2.查询是否具备操作权限
  try {
    const isPermission = await authService.checkTable(tableName, targetId, id);
    if (!isPermission) throw new Error();
    //如果没错，则调用下一个中间件
    await next();
  } catch (error) {
    const err = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit("error", err, ctx);
  }
};

// const verifyPermission = (tableName) => {
//   return async (ctx, next) => {
//     console.log("验证修改动态权限");
//     //1.获取参数
//     const { momentId } = ctx.params;
//     const { id } = ctx.user;
//     //2.查询是否具备操作权限
//     try {
//       const isPermission = await authService.checkTable(
//         tableName,
//         momentId,
//         id
//       );
//       if (!isPermission) throw new Error();
//       //如果没错，则调用下一个中间件
//       await next();
//     } catch (error) {
//       const err = new Error(errorTypes.UNPERMISSION);
//       return ctx.app.emit("error", err, ctx);
//     }
//   };
// };

module.exports = { verifyLogin, verifyAuth, verifyPermission };
