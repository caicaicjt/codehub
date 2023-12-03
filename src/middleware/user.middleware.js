const errorTypes = require("../constants/error.type");
const service = require("../service/user.service");
const md5password = require("../utils/password-handle");

const verifyUser = async (ctx, next) => {
  //1.获取用户信息
  const { name, password } = ctx.request.body;

  //2.判断用户姓名密码是否为空
  if (!name || !password) {
    const err = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", err, ctx);
  }

  //3.如果用户名已经注册了
  const result = await service.getUserByName(name);
  if (result.length) {
    const err = new Error(errorTypes.USERNAME_ALREADY_EXISTS);
    return ctx.app.emit("error", err, ctx);
  }

  //4.判断请求无误后，真正创建用户-->user.controller
  await next();
};

const handlePassword = async (ctx, next) => {
  let { password } = ctx.request.body;
  ctx.request.body.password = md5password(password);

  await next();
};

module.exports = {
  verifyUser,
  handlePassword,
};
