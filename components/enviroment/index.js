const EnviromentType = {
  PRODUCTION: '.production',
  DEVELOPMENT: '.development'
};

class Enviroment {
  constructor(name){
    this.config = require(`./${name}.js`);
  }

  getStrategy(){
    return this.config.strategy;
  }
}

module.exports = {
  Enviroment,
  EnviromentType
};