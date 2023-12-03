const errTypes = require("../constants/error.type");

const errorHandler = (error, ctx) => {
  let status, message;
  switch (error.message) {
    case errTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400; //bad request
      message = "用户名或密码不能为空";
      break;
    case errTypes.USERNAME_ALREADY_EXISTS:
      status = 409; //conflict 冲突
      message = "用户名已经存在";
      break;
    case errTypes.USERNAME_DOSE_NOT_EXISTS:
      status = 400;
      message = "用户名不存在";
      break;
    case errTypes.PASSWORD_IS_INCORRECT:
      status = 400;
      message = "密码错误";
      break;
    case errTypes.UNAUTHORIZATION:
      status = 401;
      message = "未授权/无效的token";
      break;
    case errTypes.UNPERMISSION:
      status = 401;
      message = "您不具备对应操作权限";
      break;
    default:
      status = 404;
      message = "NOT FOUND";
      break;
  }

  ctx.status = status;
  ctx.body = message;
};

module.exports = errorHandler;
