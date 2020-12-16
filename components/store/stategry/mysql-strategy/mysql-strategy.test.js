const MySQLPool = require('../../../database/mysql/mysql-pool.js');
const MySQLStrategy = require('./mysql-strategy.js');
const fs = require('fs');

const UserID = {
  EMPTY: 1,
  COMMON: 2,
  SELECT: 3,
  INSERT: 4,
  DELETE: 5,
  UPDATE: 6,
  DELETE: 7
};

describe('MySQL Strategy', () => {
  const uri = getSQLURIFromEnviroment();

  beforeAll(async () => {

    await deleteTable('configuration');
    await deleteTable('user');
    await createTable('user');

    await Promise.all([
      createTable('configuration'),
      createDefaultUsers()
    ]);
  });

  beforeEach(async() => {
    await MySQLPool.close();
  })

  afterAll(async () => {
    await MySQLPool.close();
  });


  it('can create instance with connection', async () => {
    expect(new MySQLStrategy(uri)).toBeInstanceOf(MySQLStrategy);
  });


  it('can find number of user configuration (empty)', async () => {

    await deleteUserConfigurations(UserID.EMPTY);
    const mySQLStrategy = new MySQLStrategy(uri);

    const n = await mySQLStrategy.userConfigurationCount(UserID.EMPTY);

    expect(n).toEqual(0);
  });


  it('can find number of user configuration', async () => {
    await deleteUserConfigurations(UserID.COMMON);
    const configuration = {
      userId: UserID.COMMON,
      data: JSON.stringify(
        {
          name: 'profiles-common',
          age: 30
        }
      )
    };

    await insertConfigurationForUser(configuration);

    const mySQLStrategy = new MySQLStrategy(uri);

    const n = await mySQLStrategy.userConfigurationCount(UserID.COMMON);

    expect(n).toEqual(1);
  });


  it('should be empty array if not have configuration', async () => {
    const mySQLStrategy = new MySQLStrategy(uri);

    await deleteUserConfigurations(UserID.EMPTY);

    const condition = { _userId: UserID.EMPTY, a: 2 };
    const userConfigurations = await mySQLStrategy.select(condition);

    expect(userConfigurations).toHaveLength(0);
  });


  it('can select all configuration of user', async () => {
    await deleteUserConfigurations(UserID.SELECT);
    const configuration = {
      userId: UserID.SELECT,
      data: JSON.stringify(
        {
          name: 'profiles-select-0',
          age: 30
        }
      )
    };

    await insertConfigurationForUser(configuration);
    const mySQLStrategy = new MySQLStrategy(uri);
    const condition = { _userId: UserID.SELECT };
    const userConfigurations = await mySQLStrategy.select(condition);

    expect(userConfigurations).toHaveLength(1);
  });


  it('can select configuration of by property', async () => {

    await deleteUserConfigurations(UserID.SELECT);
    const configuration = {
      userId: UserID.SELECT,
      data: JSON.stringify(
        {
          name: 'profiles-select-1',
          age: 30
        }
      )
    };

    await insertConfigurationForUser(configuration);
    await insertConfigurationForUser(configuration);

    const mySQLStrategy = new MySQLStrategy(uri);
    const condition = { _userId: UserID.SELECT, name: 'profiles-select-1' };
    const userConfigurations = await mySQLStrategy.select(condition);

    expect(userConfigurations).toHaveLength(2);
  });


  it('can insert configuration', async () => {

    await deleteUserConfigurations(UserID.INSERT);
    const configuration = {
      _userId: UserID.INSERT,
      name: {
        firstname: 'profiles-select-2',
        lastname: 'nani'
      },
      age: 30
    };


    const mySQLStrategy = new MySQLStrategy(uri);
    const id = await mySQLStrategy.insert(configuration);

    expect(Number.isInteger(id)).toBeTruthy();
  });


  it('can update configuration', async () => {
    const configuration = {
      userId: UserID.UPDATE,
      data: JSON.stringify(
        {
          name: 'profiles-update-1',
          age: 30
        }
      )
    };

    await insertConfigurationForUser(configuration);

    const assignment = {
      name: 'sudoers',
      age: 18
    };

    const condition = {
      _userId: UserID.UPDATE,
      name: 'profiles-update-1',
    };

    const mySQLStrategy = new MySQLStrategy(uri);
    const updatedConfigurations = await mySQLStrategy.update(assignment, condition);

    const checker = await mySQLStrategy.select({...condition, ...assignment});
    expect(updatedConfigurations).toHaveLength(1);
    expect(checker[0].name).toEqual('sudoers');
    expect(checker[0].age).toEqual(18);
  });

  it('should return [] of not match', async () => {
    const assignment = {
      name: 'sudoers',
      age: 18
    };

    const condition = {
      _userId: UserID.EMPTY,
      name: 'profiles-update-1',
    };

    const mySQLStrategy = new MySQLStrategy(uri);
    const updatedConfigurations = await mySQLStrategy.update(assignment, condition);

    expect(updatedConfigurations).toHaveLength(0);
  });

  it('should delete configuration', async() => {
    const configuration = {
      userId: UserID.DELETE,
      data: JSON.stringify(
        {
          name: 'profiles-delete-1',
          age: 30
        }
      )
    };

    await insertConfigurationForUser(configuration);

    const mySQLStrategy = new MySQLStrategy(uri);

    const condition = {
      _userId: UserID.DELETE,
      name: 'profiles-delete-1'
    };

    const response = await mySQLStrategy.delete(condition);

    const checker = await mySQLStrategy.select(condition);

    expect(response).toHaveLength(1);
    expect(checker).toHaveLength(0);
  });
});

function getSQLURIFromEnviroment() {
  return process.env.MYSQL_URI;
}

async function createDefaultUsers() {
  const pool = await createPool();

  for (let username in UserID) {
    let connection = await pool.getConnection();

    const query = 'INSERT INTO user(id, username, password) VALUES (?,?,?)';
    await connection.query(query, [UserID[username], username, '']);

    connection.release();
  }
}

async function createPool() {
  const uri = process.env.MYSQL_URI;
  const pool = await MySQLPool.connect(uri);
  return pool;
}

async function deleteTable(name) {
  const pool = await createPool();

  let connection = await pool.getConnection();

  const stmt = 'DROP TABLE IF EXISTS ' + name;
  await connection.execute(stmt);

  connection.release();
}

async function createTable(name) {
  const pool = await createPool();

  let connection = await pool.getConnection();

  const path = `./scripts/test/create-table-${name}.sql`;
  const buffer = fs.readFileSync(path);
  const stmt = buffer.toString();
  await connection.execute(stmt);

  connection.release();
}

async function insertConfigurationForUser(configuration) {
  const pool = await createPool();

  const connection = await pool.getConnection();

  const stmt = 'INSERT INTO configuration (data, user_id) VALUES (?, ?)';
  await connection.query(stmt, [
    configuration.data,
    configuration.userId
  ]);

  connection.release();
}

async function deleteUserConfigurations(userId) {
  const pool = await createPool();

  const connection = await pool.getConnection();

  const stmt = 'DELETE FROM configuration WHERE user_id = ?';
  await connection.query(stmt, [userId]);

  connection.release();
}
