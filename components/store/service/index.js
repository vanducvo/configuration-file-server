const { StoreTypes, Enviroment } = require('../../enviroment');
const { FileStrategy, MySQLStrategy } = require('../stategry');

class StoreService {
  constructor() {
    const storeType = Enviroment.getStoreType();
    switch (storeType) {
      case StoreTypes.FILE:
        const filepath = Enviroment.getFilePath();
        const limit = Enviroment.getFileLimitConfiguration();
        this.strategy = new FileStrategy(filepath, limit);
        break;
      case StoreTypes.MYSQL:
        const mysqluri = Enviroment.getMySQLURI();
        this.strategy = new MySQLStrategy(mysqluri);
        break;
      default:
        throw Error('No Support Storerage Style');
    }
  }

  async select(condition){
    return await this.strategy.select(condition);
  }

  async insert(configuration){
    return await this.strategy.insert(configuration);
  }

  async update(assignment, condition){
    return await this.strategy.update(assignment, condition);
  }

  async delete(condition){
    return await this.strategy.delete(condition);
  }
  
}

module.exports = StoreService;
