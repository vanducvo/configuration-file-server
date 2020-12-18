const v8 = require('v8');

class Condition {
  constructor(properties) {
    properties = Condition.deepClone(properties);

    if (!Condition.isValidProperties(properties)) {
      const message = this.constructor.name +
        ': properties is object and userID is integer number';
      throw new Error(message)
    }

    const {_userId, ..._properties} = properties;
    this._properties = {};
    
    for(const key in _properties){
      if(Condition.isObject(_properties[key]) || _properties[key] == undefined){
        continue;
      }

      this._properties[key] = _properties[key];
    }
    
    this._userId = _userId;
  }

  static deepClone(json) {
    return v8.deserialize(v8.serialize(json));
  }

  getUserId(){
    return this._userId;
  }

  static isValidProperties(properties) {
    const {_userId, ..._properties} = properties;
    return Condition.isValidUser(_userId)
      && Condition.isObject(_properties);
  }

  static isValidUser(userId) {
    return Number.isInteger(userId);
  }

  static isObject(properties) {
    return properties && properties.constructor.name === 'Object';
  }

  checkWith(context) {
    for (const propertyname in this._properties) {
      if (context[propertyname] !== this._properties[propertyname]) {
        return false;
      }
    }

    return true;
  }

  getProperties(){
    return Condition.deepClone(this._properties);
  }
}

module.exports = Condition;
