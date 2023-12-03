const connection = require("../app/database");

class AuthService {
  async checkTable(tableName, id, userId) {
    const statement = `SELECT * FROM ${tableName} WHERE id = ? AND user_id=?`;

    const [result] = await connection.execute(statement, [id, userId]);
    return result.length === 0 ? false : true;
  }
}

module.exports = new AuthService();
