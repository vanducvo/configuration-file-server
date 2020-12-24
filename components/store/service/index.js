const { StoreTypes, Enviroment } = require('../../enviroment');
const { FileStrategy, MySQLStrategy } = require('../stategry');
const MongoStrategy = require('../stategry/mongo-strategy/mongo-strategy');

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
      case StoreTypes.MONGODB:
        const mongouri = Enviroment.getMongoDBURI();
        this.strategy = new MongoStrategy(mongouri);
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
