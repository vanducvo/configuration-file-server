const StoreService = require("./index.js");
const { StoreTypes } = require("../../enviroment");
const path = require('path');
const { FileStrategy, MySQLStrategy } = require("../stategry/index.js");
const MySQLPool = require("../../database/mysql/pool.js");

describe('Test Strategy Store', () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    await MySQLPool.close();
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  afterAll(async ()=> {
    await MySQLPool.close();
  });

  it('should be FILE strategy', () => {
    setEnviromentFile();

    const service = new StoreService();

    expect(service.strategy).toBeInstanceOf(FileStrategy);
  });

  it('should be MYSQL strategy', () => {
    setEnviromentMySQL();

    const service = new StoreService();

    expect(service.strategy).toBeInstanceOf(MySQLStrategy);
  });

  it('should be MYSQL strategy', () => {
    process.env.STORE_TYPE = 'postgres';
    
    expect(() => new StoreService()).toThrowError();
  });
});

function setEnviromentMySQL() {
  process.env.STORE_TYPE = StoreTypes.MYSQL;
  process.env.MYSQL_URI = 'mysql://configuration_test:88888888@localhost:3306/configuration_test';
}

function setEnviromentFile() {
  process.env.STORE_TYPE = StoreTypes.FILE;
  process.env.FILE_PATH = path.join(process.cwd(), 'file-db');
  process.env.FILE_LIMIT_CONFIGURATION = 100;
}

