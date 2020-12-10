const { StoreTypes } = require('../enviroment/index.js');
const MySQLPool = require('./mysql-pool.js');

describe('MySQL connection', () => {

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    setEnviromentStoreType(StoreTypes.MYSQL);
    const uri = 'mysql://configuration:88888888@localhost:3306/configuration_test';
    setEnviromentMySQLURI(uri);
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  afterAll(async () => {
    await MySQLPool.close();
  });


  it('should false when not yet get connect', async () => {
    await MySQLPool.close();

    const isConnected = MySQLPool.isConnected();

    expect(isConnected).toBeFalsy();
  });

  it('can connect safe and should true when got connect', async () => {
    await MySQLPool.connect();
    await MySQLPool.connect();

    const isConnected = MySQLPool.isConnected();

    expect(isConnected).toBeTruthy();
  });

  it('can disconnect safe', async () => {
    await MySQLPool.close();
    await MySQLPool.close();

    expect(MySQLPool.isConnected()).toBeFalsy();
  });

  it('can get connect when connected', async () => {
    await MySQLPool.connect();

    const pool = await MySQLPool.get();

    expect(pool).not.toBeNull();
  });

  it('can get when disconnected', async () => {
    await MySQLPool.close();
    const pool = await MySQLPool.get();

    expect(pool).not.toBeNull();
  });
});

function setEnviromentStoreType(type) {
  process.env.STORE_TYPE = type;
}

function setEnviromentMySQLURI(uri) {
  process.env.MYSQL_URI = uri;
}