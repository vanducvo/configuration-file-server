const MySQLPool = require("../database/mysql/pool");
const UserQueryFactory = require("../database/mysql/user-query-factory");
const { Enviroment } = require("../enviroment");
const BCrypt = require('bcrypt');

class UserRepos {
  constructor() {
    this._connect = MySQLPool.connect(Enviroment.getMySQLURI());
    this._pool = MySQLPool;
    this._factory = new UserQueryFactory(
      'user',
      {
        usernameColName: 'username',
        passwordColName: 'password'
      }
    );
  }

  async insert({username, password}) {
    await this._connect;
    const hashed_password = await BCrypt.hash(password, 10);
    const {
      query,
      params,
      getter
    } = this._factory.insert({username, password: hashed_password});
    const result = await this._pool.execute(query, params);
    return getter(result);
  }

  async select(username){
    await this._connect;
    const {
      query,
      params,
      getter
    } = this._factory.select(username);
    const result = await this._pool.execute(query, params);
    return getter(result);
  }

  async verify({username, password}){
    const user = await this.select(username);

    if(!user){
      return null;
    }

    const isValid = await BCrypt.compare(password, user.password);

    if(isValid){
      return user.id;
    }

    return null;
  }
}

module.exports = UserRepos;
