const Assignment = require("../../dto/assignment");
const Condition = require("../../dto/condition");
const Configuration = require("../../dto/configuration");
const StrategyStore = require('./strategy-store.js');

class MySQLStrategy extends StrategyStore {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  static getInsertedId(response) {
    return response[0]['insertId'];
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

  async execute(query, params) {
    const connection = await this._pool.getConnection();
    const result = await connection.query(query, params);
    connection.release();
    return result;
  }

  createSelectQuery(condition) {
    const sql = condition.toSQL('data');

    const query = "SELECT JSON_INSERT(data, '$._id', id) as data \
    FROM configuration_test.configuration WHERE " + sql.code;
    return { query, sql };
  }

  createUpdateQuery(assignment, condition) {
    const sqlAssignment = assignment.toSQL('data');
    const sqlCondition = condition.toSQL('data');

    const query = 'UPDATE configuration SET ' + sqlAssignment.code
      + ' WHERE ' + sqlCondition.code;

    const params = [...sqlAssignment.params, ...sqlCondition.params];
    return { query, params };
  }

  createInsertQuery(configuration) {
    const query = 'INSERT INTO configuration(data, user_id) VALUES (?, ?)';

    const params = [
      JSON.stringify(configuration.getConfig()),
      configuration.getUserId()
    ];
    return { query, params };
  }

  async userConfigurationCount(userId) {
    const query = 'SELECT COUNT(*) as count FROM configuration WHERE user_id = ?';

    const response = await this.execute(query, [userId]);

    return MySQLStrategy.getPropertyFromSingleResponse(response, 'count');
  }

  async select(_condition) {
    const condition = new Condition(_condition);

    const { query, sql } = this.createSelectQuery(condition);

    const response = await this.execute(query, sql.params);

    return MySQLStrategy.getPropertyFromReponse(response, 'data');
  }

  async insert(_configuration) {
    const configuration = new Configuration(_configuration);

    const { query, params } = this.createInsertQuery(configuration);

    const response = await this.execute(query, params);

    return MySQLStrategy.getInsertedId(response);
  }

  async update(_assignment, _condition) {
    const assignment = new Assignment(_assignment);
    const condition = new Condition(_condition);

    const { query, params } = this.createUpdateQuery(assignment, condition);

    await this.execute(query, params);

    const updatedCondition = { ..._condition, ..._assignment };
    return this.select(updatedCondition);
  }

  async delete(_condition) {
    const condition = new Condition(_condition);

    const { query, params } = this.createDeleteQuery(condition, _condition);

    const results = this.select(_condition);
    await this.execute(query, params);

    return results;
  }

  createDeleteQuery(condition) {
    const sql = condition.toSQL('data');

    const query = 'DELETE FROM configuration WHERE ' + sql.code;

    return { query, params: sql.params };
  }
}

module.exports = MySQLStrategy;
