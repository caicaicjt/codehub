const labelService = require("../service/label.service");

const verifyLabelExists = async (ctx, next) => {
  //1.取出所有的label
  const { labels } = ctx.request.body;
  //2.判断label是否存在
  const labelList = [];

  for (let name of labels) {
    const labelResult = await labelService.getLabelByName(name);
    console.log(labelResult);
    const label = { name };
    if (!labelResult) {
      //如果不存在，则创建标签
      const result = await labelService.create(name);
      label.id = result.insertId;
    } else {
      label.id = labelResult.id;
    }
    labelList.push(label);
  }
  console.log(labelList);
  ctx.labels = labelList;

  await next();
};

module.exports = {
  verifyLabelExists,
};
