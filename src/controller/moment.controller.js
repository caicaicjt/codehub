const fs = require("fs");

const fileService = require("../service/file.service");
const momentService = require("../service/moment.service");
const { PICTURE_PATH } = require("../constants/file.path");

class MomentController {
  async create(ctx, next) {
    //1.获取user_id content
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    //2.插入数据
    const result = await momentService.create(userId, content);
    ctx.body = result;
  }
  async detail(ctx, next) {
    //1.获取momentid
    const momentId = ctx.params.momentId;

    //2.根据id查询
    const result = await momentService.getMomentById(momentId);

    ctx.body = result[0];
  }
  async list(ctx, next) {
    //1.获取offset size
    const { offset, size } = ctx.query;

    //2.查询列表数据
    const result = await momentService.getMomentList(offset, size);

    ctx.body = result;
  }
  async update(ctx, next) {
    //1.获取修改的内容和对应id
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;
    //2.获取结果
    const result = await momentService.update(content, momentId);
    ctx.body = result;
  }
  async remove(ctx, next) {
    //1.获取删除动态id
    const { momentId } = ctx.params;

    //2.操作数据库删除
    const result = await momentService.remove(momentId);

    ctx.body = result;
  }
  async addLabels(ctx, next) {
    //1.获取标签和动态id
    const { labels } = ctx;
    const { momentId } = ctx.params;
    //2.遍历添加每个动态对应的标签
    for (let label of labels) {
      //1.判断是否已经添加该标签
      const isExists = await momentService.hasLabel(momentId, label.id);
      if (!isExists) {
        await momentService.addLabel(momentId, label.id);
      }
    }

    ctx.body = "给动态添加标签成功";
  }
  async fileInfo(ctx, next) {
    //1.获取文件信息
    let { filename } = ctx.params;

    //2.根据文件名查询数据库
    const fileInfo = await fileService.getFileByFileName(filename);

    //3.返回数据
    const { type } = ctx.query;
    const types = ["small", "middle", "large"];
    if (types.some((item) => item === type)) {
      filename = filename + "-" + type;
    }
    ctx.response.set("content-type", fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }
}

module.exports = new MomentController();
