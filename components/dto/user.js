class User {
  constructor(id, username) {
    this._id = id;
    this._username = username;
    this._password = null;
  }

  getId() {
    return this._id;
  }

  setId(id) {
    this._id = id;
  }

  getUsername() {
    return this._username;
  }

  setUsername(username) {
    this._username = username;
  }

  getPassword() {
    return this._password;
  }

  setPassword(password) {
    this._password = password;
  }

  clone(){
    const copy = new User(this._id, this._username);
    copy.setPassword(this._password);
    return copy;
  }
}

module.exports = User;
