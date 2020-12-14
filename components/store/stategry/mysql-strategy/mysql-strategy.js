const MySQLQueryFactory = require('./mysql-query-factory');
const StrategyStore = require('../strategy-store.js');

class MySQLStrategy extends StrategyStore {
  constructor(pool) {
    super();
    this._pool = pool;
    this._queryFactory = new MySQLQueryFactory(
      'configuration',
      {
        configurationColName: 'data',
        userIdColName: 'user_id'
      }
    );
  }

  async execute(query, params) {
    const connection = await this._pool.getConnection();
    const result = await connection.query(query, params);
    connection.release();
    return result;
  }

  async userConfigurationCount(userId) {
    const {
      query, 
      params,
      getter
    } = this._queryFactory.countConfiguration(userId);

    const response = await this.execute(query, params);

    return getter(response);
  }

  async select(condition) {
    const {
      query,
      params,
      getter
    } = this._queryFactory.selectConfiguration(condition);

    const response = await this.execute(query, params);

    return getter(response);
  }

  async insert(configuration) {

    const {
      query,
      params,
      getter
    } = this._queryFactory.insertConfiguration(configuration);

    const response = await this.execute(query, params);

    return getter(response);
  }

  async update(assignment, condition) {

    const {
      query,
      params
    } = this._queryFactory.updateConfiguration(assignment, condition);

    await this.execute(query, params);

    const updatedCondition = { ...condition, ...assignment };
    return this.select(updatedCondition);
  }

  async delete(condition) {

    const {
      query,
      params
    } = this._queryFactory.deleteConfiguration(condition);

    const results = this.select(condition);
    await this.execute(query, params);

    return results;
  }
}

module.exports = MySQLStrategy;
