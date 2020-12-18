const MySQLPool = require('./pool.js');
const { Enviroment } = require('../../enviroment');

describe('MySQL connection', () => {
  const uri = Enviroment.getMySQLURI();

  afterAll(async () => {
    await MySQLPool.close();
  });


  it('should false when not yet get connect', async () => {
    await MySQLPool.close();

    const isConnected = MySQLPool.isConnected();

    expect(isConnected).toBeFalsy();
  });

  it('can connect safe and should true when got connect', async () => {
    await MySQLPool.connect(uri);
    await MySQLPool.connect(uri);

    const isConnected = MySQLPool.isConnected();

    expect(isConnected).toBeTruthy();
  });

  it('can disconnect safe', async () => {
    await MySQLPool.close();
    await MySQLPool.close();

    expect(MySQLPool.isConnected()).toBeFalsy();
  });

  it('can get connect when connected', async () => {
    await MySQLPool.connect(uri);

    const pool = await MySQLPool.get();

    expect(pool).not.toBeNull();
  });

  it('should throw error get when disconnected', async () => {
    await MySQLPool.close();

    await expect(MySQLPool.get()).rejects.toThrowError();
  });

  it('should throw error execute when disconnected', async () => {
    await MySQLPool.close();

    await expect(MySQLPool.execute('SELECT 1', [])).rejects.toThrowError();
  });

  it('should throw error execute multi when disconnected', async () => {
    await MySQLPool.close();

    await expect(MySQLPool.executeMultiquery(['SELECT 1'], [[]])).rejects.toThrowError();
  });
});
