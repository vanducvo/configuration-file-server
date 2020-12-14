const v8 = require('v8');

class Configuration {
  constructor(properties) {
    if (!Configuration.isValidProperties(properties)) {
      const message = this.constructor.name +
        ': properties is object and userID is integer number';
      throw new Error(message)
    }

    const {_userId, ..._properties} = properties;

    this._properties = Configuration.deepClone(_properties);
    this._userId = _userId;
  }

  static isValidProperties(properties) {
    const { _userId, ..._properties } = properties;
    return Configuration.isValidUser(_userId)
      && Configuration.isObject(_properties);
  }

  static isValidUser(userId) {
    return Number.isInteger(userId);
  }

  static isObject(properties) {
    return properties && properties.constructor.name === 'Object';
  }

   static deepClone(json) {
    return v8.deserialize(v8.serialize(json));
  }

  getConfig() {
    return { ...this._properties };
  }

  getUserId() {
    return this._userId;
  }
}

module.exports = Configuration;
