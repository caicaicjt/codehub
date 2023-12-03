const path = require("path");
const multer = require("koa-multer");
const jimp = require("jimp");
const { AVATAR_PATH, PICTURE_PATH } = require("../constants/file.path");

const avatarUpload = new multer({
  dest: AVATAR_PATH,
});

const avatarHandler = avatarUpload.single("avatar");

const pictureUpload = new multer({
  dest: PICTURE_PATH,
});

const pictureHandler = pictureUpload.array("picture", 9);

const pictureResize = async (ctx, next) => {
  //1.获取所有图片信息
  const files = ctx.req.files;

  //2.对所有图片处理，resize (sharp/jimp)

  for (let file of files) {
    const destPath = path.join(file.destination, file.filename);
    console.log(destPath);
    jimp.read(file.path).then((image) => {
      image.resize(1280, jimp.AUTO).write(`${destPath}-large`);
      image.resize(640, jimp.AUTO).write(`${destPath}-middle`);
      image.resize(320, jimp.AUTO).write(`${destPath}-small`);
    });
  }
  await next();
};

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize,
};
