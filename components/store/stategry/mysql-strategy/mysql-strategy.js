const ConfigurationQueryFactory = require('../../../database/mysql/configuration-query-factory.js');
const StrategyStore = require('../strategy-store.js');
const MySQLPool = require('../../../database/mysql/pool.js');
const Condition = require('../dto/condition.js');
const Configuration = require('../dto/configuration.js');
const Assignment = require('../dto/assignment.js');

class MySQLStrategy extends StrategyStore {
  constructor(uri) {
    super();
    this._connect = MySQLPool.connect(uri);
    this._pool = MySQLPool;
    this._queryFactory = new ConfigurationQueryFactory(
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

  async select(_condition) {
    const condition = new Condition(_condition);
    const {
      query,
      params,
      getter
    } = this._queryFactory.selectConfiguration(
      condition.getProperties(),
      condition.getUserId()
    );

    await this._connect;
    const response = await this._pool.execute(query, params);

    return getter(response);
  }

  async insert(_configuration) {
    const configuration = new Configuration(_configuration);
    const {
      query,
      params,
      getter
    } = this._queryFactory.insertConfiguration(
      configuration.getProperties(),
      configuration.getUserId()
    );

    await this._connect;
    const response = await this._pool.execute(query, params);

    return getter(response);
  }

  async update(_assignment, _condition) {
    const assignment = new Assignment(_assignment);
    const condition = new Condition(_condition);

    const {
      queries,
      listOfParams
    } = this._queryFactory.updateConfiguration(
      assignment.getProperties(),
      condition.getProperties(),
      condition.getUserId()
    );

    await this._connect;

    await this._pool.executeMultiquery(queries, listOfParams);
    
    const updatedCondition = { ..._condition, ..._assignment };
    return await this.select(updatedCondition);
  }

  async delete(_condition) {
    const condition = new Condition(_condition);
    const {
      query,
      params
    } = this._queryFactory.deleteConfiguration(
      condition.getProperties(),
      condition.getUserId()
    );

    await this._connect;
    const results = await this.select(_condition);
    await this._pool.execute(query, params);

    return results;
  }
}

module.exports = MySQLStrategy;
