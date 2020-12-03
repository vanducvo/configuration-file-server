const v8 = require('v8');

class Configuration {
  constructor(user, config = {}){
    this._config = this.deepClone(config);
    this._user = user;
  }

  deepClone(config) {
    return v8.deserialize(v8.serialize(config));
  }

  getConfig(){
    return {...this._config};
  }

  setConfig(config){
    this._config = this.deepClone(config);
  }

  getUser(){
    return this._user;
  }
}

module.exports = Configuration;
