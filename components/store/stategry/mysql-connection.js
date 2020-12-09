const mysql = require('mysql2/promise');
const { Enviroment } = require('../enviroment');

class MySQLConnection {

  constructor() {
    this.db = null;
  }

  async connect() {
    if (!this.isConnected()) {
      const configuration = {
        uri: Enviroment.getMySQLURI()
      };
      this.db = await mysql.createConnection(configuration);
    }

    return this.db;
  }

  async get() {
    if (!this.isConnected()) {
      return await this.connect();
    }

    return this.db;
  }

  async close() {
    if (!this.isConnected()) {
      return;
    }

    await this.db.end();
    this.db = null;
  }

  isConnected() {
    if (!this.db) {
      return false;
    }

    return true;
  }
}

module.exports = new MySQLConnection();