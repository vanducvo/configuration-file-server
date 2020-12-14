const mysql = require('mysql2/promise');

class MySQLPool {
  static db = null;

  static async connect(uri) {
    if (!MySQLPool.isConnected()) {
      const configuration = {
        uri: uri
      };

      MySQLPool.db = await mysql.createPool(configuration);
      
      process.on('exit', () => {
        MySQLPool.close();
      });
    }

    return this.db;
  }

  static async execute(query, params) {
    if (!MySQLPool.isConnected()) {
      throw Error('Must be connect to MYSQL before Execute Query');
    }

    const connection = await MySQLPool.db.getConnection();
    const result = await connection.query(query, params);
    connection.release();
    return result;
  }

  static async get() {
    if (!MySQLPool.isConnected()) {
      throw Error('Must be connect to MYSQL before get Pool');
    }

    return MySQLPool.db;
  }

  static async close() {
    if (!MySQLPool.isConnected()) {
      return;
    }

    await MySQLPool.db.end();
    MySQLPool.db = null;
  }

  static isConnected() {
    if (!MySQLPool.db) {
      return false;
    }

    return true;
  }
}

module.exports = MySQLPool;
