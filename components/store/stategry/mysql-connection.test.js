const { StoreTypes } = require('../enviroment/index.js');
const MySQLConnection = require('./mysql-connection.js');

describe('MySQL connection', () => {

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    setEnviromentStoreType(StoreTypes.MYSQL);
    const uri = 'mysql://configuration:88888888@localhost:3306/configuration';
    setEnviromentMySQLURI(uri);
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  afterAll(async () => {
    await MySQLConnection.close();
  });


  it('should false when not yet get connect', async () => {
    await MySQLConnection.close();

    const isConnected = MySQLConnection.isConnected();

    expect(isConnected).toBeFalsy();
  });

  it('can connect safe and should true when got connect', async () => {
    await MySQLConnection.connect();
    await MySQLConnection.connect();

    const isConnected = MySQLConnection.isConnected();

    expect(isConnected).toBeTruthy();
  });

  it('can disconnect safe', async () => {
    await MySQLConnection.close();
    await MySQLConnection.close();

    expect(MySQLConnection.isConnected()).toBeFalsy();
  });

  it('can get connect when connected', async () => {
    await MySQLConnection.connect();

    const connection = await MySQLConnection.get();

    expect(connection).not.toBeNull();
  });

  it('can get when disconnected', async () => {
    await MySQLConnection.close();
    const connection = await MySQLConnection.get();

    expect(connection).not.toBeNull();
  });
});

function setEnviromentStoreType(type) {
  process.env.STORE_TYPE = type;
}

function setEnviromentMySQLURI(uri) {
  process.env.MYSQL_URI = uri;
}