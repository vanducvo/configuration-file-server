const mysql = require('mysql2/promise');

class MySQLPool {
  static db = null;

  static async connect(uri) {
    if (!MySQLPool.isConnected()) {
      const configuration = {
        uri: uri
      };

      MySQLPool.db = await mysql.createPool(configuration);
    }

    return MySQLPool.db;
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

  static async executeMultiquery(queries, listOfParams) {
    if (!MySQLPool.isConnected()) {
      throw Error('Must be connect to MYSQL before Execute Query');
    }

    const connection = await MySQLPool.db.getConnection();
    await connection.beginTransaction();

    const results = [];

    try{
      for(const index in queries){
        const result = await connection.query(queries[index], listOfParams[index]);
        results.push(result);
      }
      await connection.commit();
      
    }catch(error){
      await connection.rollback();
    }

    connection.release();
    return results;
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
