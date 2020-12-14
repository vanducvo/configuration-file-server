const { StoreTypes, Enviroment } = require('../enviroment');
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

  select(condition){
    return this.strategy.select(condition);
  }

  insert(configuration){
    return this.strategy.insert(configuration);
  }

  update(assignment, condition){
    return this.strategy.update(assignment, condition);
  }

  delete(condition){
    return this.strategy.delete(condition);
  }
  
}

module.exports = StoreService;
