const MySQLQueryFactory = require('./mysql-query-factory');
const StrategyStore = require('../strategy-store.js');
const MySQLPool = require('./mysql-pool.js');

class MySQLStrategy extends StrategyStore {
  constructor(uri) {
    super();
    MySQLPool.connect(uri);
    this._pool =  MySQLPool;
    this._queryFactory = new MySQLQueryFactory(
      'configuration',
      {
        configurationColName: 'data',
        userIdColName: 'user_id'
      }
    );
  }

  async userConfigurationCount(userId) {
    const {
      query, 
      params,
      getter
    } = this._queryFactory.countConfiguration(userId);

    const response = await this._pool.execute(query, params);

    return getter(response);
  }

  async select(condition) {
    const {
      query,
      params,
      getter
    } = this._queryFactory.selectConfiguration(condition);

    const response = await this._pool.execute(query, params);

    return getter(response);
  }

  async insert(configuration) {

    const {
      query,
      params,
      getter
    } = this._queryFactory.insertConfiguration(configuration);

    const response = await this._pool.execute(query, params);

    return getter(response);
  }

  async update(assignment, condition) {

    const {
      query,
      params
    } = this._queryFactory.updateConfiguration(assignment, condition);

    await this._pool.execute(query, params);

    const updatedCondition = { ...condition, ...assignment };
    return this.select(updatedCondition);
  }

  async delete(condition) {

    const {
      query,
      params
    } = this._queryFactory.deleteConfiguration(condition);

    const results = this.select(condition);
    await this._pool.execute(query, params);

    return results;
  }
}

module.exports = MySQLStrategy;
