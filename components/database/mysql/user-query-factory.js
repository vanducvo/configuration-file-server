const { response } = require("express");
const { use } = require("passport");

class UserQueryFactory {
  constructor(tableName, { usernameColName, passwordColName }) {
    this._tableName = tableName;
    this._usernameColName = usernameColName;
    this._passwordColName = passwordColName;
  }

  static getInsertedId(response) {
    return response[0]['insertId'];
  }

  insert({ username, password }) {
    const query = `INSERT INTO ${this._tableName}`
      + `(${this._usernameColName}, ${this._passwordColName}) VALUES (?, ?)`;
    const params = [username, password];

    return {
      query,
      params,
      getter: UserQueryFactory.getInsertedId
    }
  }

  select(username) {
    const query = `SELECT id, ${this._usernameColName}, ${this._passwordColName}`
      + ` FROM ${this._tableName} WHERE ${this._usernameColName} = ?`;
    const params = [username];

    return {
      query,
      params,
      getter: this.getSingleUser.bind(this)
    }

  }

  getSingleUser(response) {
    const user = response[0][0];
    if(!user){
      return null;
    }
    
    return {
      id: user['id'],
      username: user[this._usernameColName],
      password: user[this._passwordColName]
    };
  }
};
module.exports = UserQueryFactory;