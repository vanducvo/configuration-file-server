class User {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.password = null;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getUsername() {
    return this.username;
  }

  setUsername(username) {
    this.username = username;
  }

  getPassword() {
    return this.password;
  }

  setPassword(password) {
    this.password = password;
  }
}

module.exports = User;