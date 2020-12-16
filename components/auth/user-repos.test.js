const MySQLPool = require('../database/mysql/pool.js');
const { Enviroment } = require('../enviroment/index.js');
const UserRepos = require('./user-repos.js');

const Username = {
  NOT_FOUND: '',
  EMPTY: 'empty',
  COMMON: 'common',
  REAL: 'real',
  FAKE: 'fake',
}

describe('User Repositories', () => {

  beforeAll(async () => {
    await MySQLPool.connect(Enviroment.getMySQLURI());
    await MySQLPool.execute('DROP TABLE IF EXISTS configuration');
    await deleteUser(Username.COMMON);
    await MySQLPool.execute('INSERT INTO user(username, password) VALUES (?,?)', [Username.COMMON, '']);
    await MySQLPool.close();
  });

  beforeEach(async () => {
    await MySQLPool.connect(Enviroment.getMySQLURI());
    await deleteUser(Username.EMPTY);
    await deleteUser(Username.REAL);
    await deleteUser(Username.FAKE);
    await deleteUser(Username.NOT_FOUND);
    await MySQLPool.close();
  });

  afterAll(async () => {
    await MySQLPool.close();
  });


  it('can create instance', () => {
    expect(new UserRepos()).toBeInstanceOf(UserRepos);
  });

  it('can insert new user', async () => {
    const userRepos = new UserRepos();
    const insertedId = await userRepos.insert({ username: Username.EMPTY, password: '' });
    expect(insertedId).toBeGreaterThan(0);
  });

  it('can select by username', async () => {
    const userRepos = new UserRepos();
    const user = await userRepos.select(Username.COMMON);

    expect(user).not.toBeNull();
    expect(user.username).toEqual(Username.COMMON);
  });

  it('should return null select by username not found' , async () => {
    const userRepos = new UserRepos();
    const user = await userRepos.select(Username.NOT_FOUND);

    expect(user).toBeNull();
  });

  it('can verify user', async () => {
    const userRepos = new UserRepos();

    const password = '22332233';
    await userRepos.insert({username: Username.REAL, password: password})
    const isValid = await userRepos.verify({username: Username.REAL, password});

    expect(isValid).toBeTruthy();
  });


  it('can verify user - fail', async () => {
    const userRepos = new UserRepos();

    const password = '22332233';
    await userRepos.insert({username: Username.REAL, password: password})
    const isValid = await userRepos.verify({username: Username.REAL, password: ''});

    expect(isValid).toBeFalsy();
  });


  it('can verify user (not exist) - fail', async () => {
    const userRepos = new UserRepos();
    const isValid = await userRepos.verify({username: Username.EMPTY, password: ''});

    expect(isValid).toBeFalsy();
  });
});

async function deleteUser(username) {
  await MySQLPool.execute('DELETE FROM user WHERE username = ?', [username]);
}
