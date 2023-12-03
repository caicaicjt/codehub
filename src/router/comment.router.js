const Router = require("koa-router");

const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth.middleware");
const {
  create,
  reply,
  update,
  remove,
  list,
} = require("../controller/comment.controller");
const commentRouter = new Router({ prefix: "/comment" });

commentRouter.post("/", verifyAuth, create);
commentRouter.post("/:commentId/reply", verifyAuth, reply);
//方式一：闭包
// commentRouter.patch(
//   "/:commentId",
//   verifyAuth,
//   verifyPermission("comment"),
//   update
// );
//方式二：字符串操作
commentRouter.patch("/:commentId", verifyAuth, verifyPermission, update);
commentRouter.delete("/:commentId", verifyAuth, verifyPermission, remove);

commentRouter.get("/", list);

module.exports = commentRouter;
