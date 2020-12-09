class MySQLStrategy {
  constructor(connection){
    this._connection = connection;
  }

  async userConfigurationCount(userId){
    const query = 'SELECT COUNT(*) as count FROM configuration WHERE user_id = ?';

    const response = await this._connection.query(query, [userId]);

    return MySQLStrategy.getPropertyFromResponse(response, 'count');
  }

  static getPropertyFromResponse(response, name) {
    return response[0][0][name];
  }
}

module.exports = MySQLStrategy;
