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

    return MySQLStrategy.getPropertyFromResponse(response, 'count');
  }

  static getPropertyFromResponse(response, name) {
    return response[0][0][name];
  }
}

module.exports = MySQLStrategy;
