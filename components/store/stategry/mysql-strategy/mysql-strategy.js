const MySQLQueryFactory = require('./mysql-query-factory');
const StrategyStore = require('../strategy-store.js');
const MySQLPool = require('../../../database/mysql-pool.js');

class MySQLStrategy extends StrategyStore {
  constructor(uri) {
    super();
    this._connect = MySQLPool.connect(uri);
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

    await this._connect;
    const response = await this._pool.execute(query, params);

    return getter(response);
  }

  async select(condition) {
    const {
      query,
      params,
      getter
    } = this._queryFactory.selectConfiguration(condition);

    await this._connect;
    const response = await this._pool.execute(query, params);

    return getter(response);
  }

  async insert(configuration) {

    const {
      query,
      params,
      getter
    } = this._queryFactory.insertConfiguration(configuration);

    await this._connect;
    const response = await this._pool.execute(query, params);

    return getter(response);
  }

  async update(assignment, condition) {

    const {
      query,
      params
    } = this._queryFactory.updateConfiguration(assignment, condition);

    await this._connect;
    await this._pool.execute(query, params);

    const updatedCondition = { ...condition, ...assignment };
    return await this.select(updatedCondition);
  }

  async delete(condition) {

    const {
      query,
      params
    } = this._queryFactory.deleteConfiguration(condition);

    await this._connect;
    const results = await this.select(condition);
    await this._pool.execute(query, params);

    return results;
  }
}

module.exports = MySQLStrategy;
