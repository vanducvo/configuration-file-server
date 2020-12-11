const { StoreTypes } = require('../enviroment/index.js');
const MySQLPool = require('./mysql-pool.js');
const MySQLStrategy = require('./mysql-strategy.js');
const fs = require('fs');

const UserID = {
  EMPTY: 1,
  COMMON: 2,
  SELECT: 3,
  INSERT: 4,
  DELETE: 5,
};

describe('MySQL Strategy', () => {
  const OLD_ENV = process.env;

  beforeAll(async () => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    setEnviromentStoreType(StoreTypes.MYSQL);
    const uri = 'mysql://configuration:88888888@localhost:3306/configuration_test';
    setEnviromentMySQLURI(uri);

    // Users Prepares
    const pool = await MySQLPool.get();

    await deleteTable(pool, 'configuration');
    await deleteTable(pool, 'user');
    await createTable(pool, 'user');

    await Promise.all([
      createTable(pool, 'configuration'),
      createDefaultUsers(pool)
    ]);
  });

  afterAll(() => {
    MySQLPool.close();
    process.env = OLD_ENV;
  });

  it('can create instance with connection', async () => {
    const pool = await MySQLPool.get();

    expect(new MySQLStrategy(pool)).toBeInstanceOf(MySQLStrategy);
  });

  it('can find number of user configuration (empty)', async () => {
    const pool = await MySQLPool.get();

    await deleteUserConfigurations(pool, UserID.EMPTY);
    const mySQLStrategy = new MySQLStrategy(pool);

    const n = await mySQLStrategy.userConfigurationCount(UserID.EMPTY);

    expect(n).toEqual(0);
  });

  it('can find number of user configuration', async () => {
    const pool = await MySQLPool.get();


    await deleteUserConfigurations(pool, UserID.COMMON);
    const configuration = {
      userId: UserID.COMMON,
      data: JSON.stringify(
        {
          name: 'profiles-common',
          age: 30
        }
      )
    };



    await insertConfigurationForUser(pool, configuration);

    const mySQLStrategy = new MySQLStrategy(pool);

    const n = await mySQLStrategy.userConfigurationCount(UserID.COMMON);

    expect(n).toEqual(1);
  });

  it('should be empty array if not have configuration', async () => {
    const pool = await MySQLPool.get();
    const mySQLStrategy = new MySQLStrategy(pool);

    await deleteUserConfigurations(pool, UserID.EMPTY);

    const condition = { _userId: UserID.EMPTY, a: 2 };
    const userConfigurations = await mySQLStrategy.select(condition);

    expect(userConfigurations).toHaveLength(0);
  });

  it('can select all configuration of user', async () => {
    const pool = await MySQLPool.get();

    await deleteUserConfigurations(pool, UserID.SELECT);
    const configuration = {
      userId: UserID.SELECT,
      data: JSON.stringify(
        {
          name: 'profiles-select-0',
          age: 30
        }
      )
    };

    await insertConfigurationForUser(pool, configuration);
    const mySQLStrategy = new MySQLStrategy(pool);
    const condition = { _userId: UserID.SELECT };
    const userConfigurations = await mySQLStrategy.select(condition);

    expect(userConfigurations).toHaveLength(1);
  });

  it('can select configuration of by property', async () => {
    const pool = await MySQLPool.get();

    await deleteUserConfigurations(pool, UserID.SELECT);
    const configuration = {
      userId: UserID.SELECT,
      data: JSON.stringify(
        {
          name: 'profiles-select-1',
          age: 30
        }
      )
    };

    await insertConfigurationForUser(pool, configuration);
    await insertConfigurationForUser(pool, configuration);

    const mySQLStrategy = new MySQLStrategy(pool);
    const condition = { _userId: UserID.SELECT, name: 'profiles-select-1' };
    const userConfigurations = await mySQLStrategy.select(condition);

    expect(userConfigurations).toHaveLength(2);
  });

  it('can insert configuration', async () => {
    const pool = await MySQLPool.get();

    await deleteUserConfigurations(pool, UserID.INSERT);
    const configuration = {
      _userId: UserID.INSERT,
      name: {
        firstname: 'profiles-select-2',
        lastname: 'nani'
      },
      age: 30
    };


    const mySQLStrategy = new MySQLStrategy(pool);
    const id = await mySQLStrategy.insert(configuration);

    expect(Number.isInteger(id)).toBeTruthy();
  });

});

async function createDefaultUsers(pool) {
  for (let username in UserID) {
    let connection = await pool.getConnection();

    const query = 'INSERT INTO user(id, username, password) VALUES (?,?,?)';
    await connection.query(query, [UserID[username], username, '']);

    connection.release();
  }
}

async function deleteTable(pool, name) {
  let connection = await pool.getConnection();

  const stmt = 'DROP TABLE IF EXISTS ' + name;
  await connection.execute(stmt);

  connection.release();
}

async function createTable(pool, name) {
  let connection = await pool.getConnection();

  const path = `./scripts/test/create-table-${name}.sql`;
  const buffer = fs.readFileSync(path);
  const stmt = buffer.toString();
  await connection.execute(stmt);

  connection.release();
}

async function insertConfigurationForUser(pool, configuration) {
  const connection = await pool.getConnection();

  const stmt = 'INSERT INTO configuration (data, user_id) VALUES (?, ?)';
  await connection.query(stmt, [
    configuration.data,
    configuration.userId
  ]);

  connection.release();
}

async function deleteUserConfigurations(pool, userId) {
  const connection = await pool.getConnection();

  const stmt = 'DELETE FROM configuration WHERE user_id = ?';
  await connection.query(stmt, [userId]);

  connection.release();
}

function setEnviromentStoreType(type) {
  process.env.STORE_TYPE = type;
}

function setEnviromentMySQLURI(uri) {
  process.env.MYSQL_URI = uri;
}