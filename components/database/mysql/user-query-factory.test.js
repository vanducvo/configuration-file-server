const { use } = require("passport");
const UserQueryFactory = require("./user-query-factory");

describe('User Query Factory', () => {
  it('can generate insert user query', () => {
    const factory = new UserQueryFactory(
      'user',
      {
        usernameColName: 'username',
        passwordColName: 'password',
      }
    );

    const user = { username: 'a', password: 'b' };
    const expectQuery = 'INSERT INTO user(username, password) VALUES (?, ?)';
    const expectPrarams = [user.username, user.password];
    const { query, params } = factory.insert(user);
    expect(query).toEqual(expectQuery);
    expect(params).toEqual(expectPrarams);
  });

  it('can generate select user by username', async () => {
    const factory = new UserQueryFactory(
      'user',
      {
        usernameColName: 'username',
        passwordColName: 'password',
      }
    );

    const expectQuery = 'SELECT id, username, password FROM user WHERE username = ?';
    const username = 'suoders';
    const expectPrarams = [username];
    const { query, params } = factory.select(username);
    expect(query).toEqual(expectQuery);
    expect(params).toEqual(expectPrarams);
  });
});