const Condition = require("../../dto/condition");

class MySQLStrategy {
  constructor(pool){
    this._pool = pool;
  }

  async execute(query, params){
    const connection = await this._pool.getConnection();
    const result = await connection.query(query, params);
    connection.release();
    return result;
  }

  async userConfigurationCount(userId){
    const query = 'SELECT COUNT(*) as count FROM configuration WHERE user_id = ?';

    const response = await this.execute(query, [userId]);

    return MySQLStrategy.getPropertyFromSingleResponse(response, 'count');
  }

  async select(_condition){
    const condition = new Condition(_condition);

    const sql = condition.toSQL('data');

    const query = "SELECT JSON_INSERT(data, '$._id', id) as data \
    FROM configuration_test.configuration WHERE " + sql.code;

    const response = await this.execute(query, sql.params);

    return MySQLStrategy.getPropertyFromReponse(response, 'data');
  }

  static getPropertyFromReponse(response, name) {
    let results = [];

    for (let row of response[0]) {
      results.push(row[name]);
    }

    return results;
  }

  static getPropertyFromSingleResponse(response, name) {
    return response[0][0][name];
  }
}

module.exports = MySQLStrategy;
