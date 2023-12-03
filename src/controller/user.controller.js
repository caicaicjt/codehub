const fs = require("fs");

const service = require("../service/user.service");
const fileService = require("../service/file.service");
const { AVATAR_PATH } = require("../constants/file.path");

class UserController {
  async create(ctx, next) {
    //获取用户请求传递过来的参数
    const user = ctx.request.body;
    //查询数据
    const result = await service.create(user);
    //返回数据
    ctx.body = result;
  }
  async avatarInfo(ctx, next) {
    //获取用户信息
    const { userId } = ctx.params;
    //根据用户id查询头像信息
    const avatarInfo = await fileService.getAvatarByUserId(userId);

    //返回图像信息(在浏览器中请求，会当成普通文件下载下来，不能直接展示图片)
    // ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
    //在响应中设置类型,这样就可以展示图片了
    ctx.response.set("content-type", avatarInfo.mimetype);
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
  }
}

module.exports = new UserController();
