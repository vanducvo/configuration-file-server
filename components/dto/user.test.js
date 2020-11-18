const User = require("./user");

describe('User Class', () => {
  const username = ' Sudoers';
  const id = 10;

  it('should have constructor with arguments', () => {
    const user = new User(id, username);

    expect(user).toBeInstanceOf(User);
  });

  it('should have constructor get id', () => {
    const user = new User(id, username);

    expect(user.getId()).toEqual(id);
  });

  it('should have constructor set id', () => {
    const user = new User(id, username);
    const newId = id + 10;

    user.setId(newId);

    expect(user.getId()).toEqual(newId);
  });

  it('should have constructor get username', () => {
    const user = new User(id, username);

    expect(user.getUsername()).toEqual(username);
  });

  it('should have constructor set username', () => {
    const user = new User(id, username);
    const newUsername = username + "new";

    user.setUsername(newUsername);

    expect(user.getUsername()).toEqual(newUsername);
  });

  it('should have constructor set password', () => {
    const user = new User(id, username);

    expect(user.getPassword()).toBeNull();
  });

  it('should have constructor set password', () => {
    const user = new User(id, username);
    const password = 'secret';

    user.setPassword(password);

    expect(user.getPassword()).toEqual(password);
  });

});