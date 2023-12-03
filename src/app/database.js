const mysql = require("mysql2");

const config = require("./config");

// MYSQL_HOST,
//   MYSQL_PORT,
//   MYSQL_DATABASE,
//   MYSQL_USER,
//   MYSQL_PASSWORD,
const connections = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
});

connections.getConnection((err, conn) => {
  conn.connect((err) => {
    if (err) {
      console.log("连接失败", err);
    } else {
      console.log("数据库连接成功", err);
    }
  });
});

module.exports = connections.promise();
