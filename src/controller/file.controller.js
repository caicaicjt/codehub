const fileService = require("../service/file.service");
const userService = require("../service/user.service");
const { AVATAR_PATH } = require("../constants/file.path");
const { APP_HOST, APP_PORT } = require("../app/config");

class FileController {
  async saveAvatarInfo(ctx, next) {
    //1.获取图片信息
    const { filename, mimetype, size } = ctx.req.file;
    const { id } = ctx.user;

    //2.将图像信息保存在数据库
    const result = await fileService.createAvatarInfo(
      filename,
      mimetype,
      size,
      id
    );
    //3.给用户信息添加头像url
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    try {
      await userService.updateAvatarUrlById(avatarUrl, id);
    } catch (error) {
      console.log(error);
    }
    //4.返回结果
    ctx.body = "上传头像成功~";
  }
  async savePictureInfo(ctx, next) {
    //1.获取图片信息
    console.log("fawf");
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;

    //2.将图片信息保存到数据库
    for (let file of files) {
      const { filename, mimetype, size } = file;
      await fileService.createFile(filename, mimetype, size, id, momentId);
    }

    ctx.body = "动态配图上传成功~";
  }
}
module.exports = new FileController();
