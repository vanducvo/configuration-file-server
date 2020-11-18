const v8 = require('v8');

class Configure {
  constructor(config = {}){
    this.config = this.deepClone(config);
  }

  deepClone(config) {
    return v8.deserialize(v8.serialize(config));
  }

  getConfig(){
    return {...this.config};
  }

  setConfig(config){
    this.config = this.deepClone(config);
  }
}

module.exports = Configure;
