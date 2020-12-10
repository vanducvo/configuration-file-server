const { StoreTypes } = require('../enviroment/index.js');
const MySQLPool = require('./mysql-pool.js');
const MySQLStrategy = require('./mysql-strategy.js');
const fs = require('fs');

const UserID = {
  EMPTY: 1,
  COMMON: 2
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
    await createTable(pool ,'user');

    await Promise.all([
      createTable(pool ,'configuration'),
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
      name: 'profiles',
      data: JSON.stringify(
        {
          name: 'sudoers',
          age: 30
        }
      )
    };

    await insertConfigurationForUser(pool, configuration);

    const mySQLStrategy = new MySQLStrategy(pool);

    const n = await mySQLStrategy.userConfigurationCount(UserID.COMMON);
  
    expect(n).toEqual(1);
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
  
  const stmt = 'INSERT INTO configuration (name, data, user_id) VALUES (?, ?, ?)';
  await connection.query(stmt, [
    configuration.name,
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