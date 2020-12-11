class Condition {
  constructor(properties) {

    if (!Condition.isValidProperties(properties)) {
      const message = this.constructor.name +
        ': properties is object and userID is integer number';
      throw new Error(message)
    }

    const {_userId, ..._properties} = properties;

    this._properties = _properties;
    this._userId = _userId;
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

  toSQL(jsonName){
    let code = 'user_id = ?';
    let params = [this._userId];

    for(const propertyname in this._properties){
      if(propertyname === '_id'){
        code += ` AND id = ?`;
      } else {
        code += ` AND ${jsonName}->"$.${propertyname}" = ?`;
      }

      
      params.push(this._properties[propertyname]);
    }

    return {code, params};
  }
}

module.exports = Condition;
