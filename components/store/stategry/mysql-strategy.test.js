const { StoreTypes } = require('../enviroment/index.js');
const MySQLConnection = require('./mysql-connection.js');
const MySQLStrategy = require('./mysql-strategy.js');

const UserID = {
  EMPTY: 0,
  COMMON: 1
};

describe('MySQL Strategy', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    setEnviromentStoreType(StoreTypes.MYSQL);
    const uri = 'mysql://configuration:88888888@localhost:3306/configuration_test';
    setEnviromentMySQLURI(uri);
  });

  afterAll(() => {
    MySQLConnection.close();
    process.env = OLD_ENV;
  });

  it('can create instance with connection', async () => {
    const connection = await MySQLConnection.get();

    expect(new MySQLStrategy(connection)).toBeInstanceOf(MySQLStrategy);
  });

  it('can find number of user configuration (empty)', async () => {
    const connection = await MySQLConnection.get();
    const mySQLStrategy = new MySQLStrategy(connection);

    const n = await mySQLStrategy.userConfigurationCount(UserID.EMPTY);

    expect(n).toEqual(0);
  });

  it('can find number of user configuration', async () => {
    const connection = await MySQLConnection.get();
    const mySQLStrategy = new MySQLStrategy(connection);

    const n = await mySQLStrategy.userConfigurationCount(UserID.COMMON);

    expect(n).toEqual(1);
  });

});

function setEnviromentStoreType(type) {
  process.env.STORE_TYPE = type;
}

function setEnviromentMySQLURI(uri) {
  process.env.MYSQL_URI = uri;
}