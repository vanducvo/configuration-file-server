const User = require("./user");

describe('User Class', () => {
  const username = ' Sudoers';
  const id = 10;

  it('should have constructor with id, username arguments', () => {
    const user = new User(id, username);

    expect(user).toBeInstanceOf(User);
  });

  it('should have get id', () => {
    const user = new User(id, username);

    expect(user.getId()).toEqual(id);
  });

  it('should have constructor set id', () => {
    const user = new User(id, username);
    const newId = id + 10;

    user.setId(newId);

    expect(user.getId()).toEqual(newId);
  });

  it('should have get username', () => {
    const user = new User(id, username);

    expect(user.getUsername()).toEqual(username);
  });

  it('should have set username', () => {
    const user = new User(id, username);
    const newUsername = username + "new";

    user.setUsername(newUsername);

    expect(user.getUsername()).toEqual(newUsername);
  });

  it('should have set password', () => {
    const user = new User(id, username);

    expect(user.getPassword()).toBeNull();
  });

  it('should have set password', () => {
    const user = new User(id, username);
    const password = 'secret';

    user.setPassword(password);

    expect(user.getPassword()).toEqual(password);
  });

  it('should have clone function', () => {
    const user = new User(id, username);
    const password = 'secret';

    let cloneUser = user.clone();
    expect(cloneUser.getId()).toEqual(user.getId());
    expect(cloneUser.getPassword()).toEqual(user.getPassword());
    expect(cloneUser.getUsername()).toEqual(user.getUsername());
    
    const newUsername = 'clone';
    cloneUser.setUsername(newUsername);

    expect(cloneUser.getUsername()).toEqual(newUsername);
    expect(user.getUsername()).not.toEqual(newUsername);
  });

});
