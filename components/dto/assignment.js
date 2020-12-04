const v8 = require('v8');

class Assignment {
  constructor(properties) {
    if (!Assignment.isValidProperties(properties)) {
      const message = this.getClassName() +
        ': properties is object and _id is immutable';
      throw new Error(message)
    }

    this._properties = Assignment.deepClone(properties);
  }

  static isValidProperties(properties) {
    return Assignment.isObject(properties)
      && !Object.keys(properties).includes('_id');
  }

  static isObject(properties) {
    return properties 
      && typeof (properties) === 'object'
      && properties.constructor.name === 'Object';
  }

  static deepClone(json) {
    return v8.deserialize(v8.serialize(json));
  }

  apply(_context) {
    if(!Assignment.isObject(_context)){
      const message = this.getClassName() +
      ':apply context must be object';
      throw new Error(message)
    }

    const context = Assignment.deepClone(_context);
    const nameOfProperties = Object.getOwnPropertyNames(this._properties);
    
    for(let propertyName of nameOfProperties){
      if(propertyName in context){
        if(this._properties[propertyName] === undefined){
          delete context[propertyName];
        }else{
          context[propertyName] = this._properties[propertyName];
        }
        
      } else {
        throw new Error(`${this.getClassName()}: context not have ${propertyName} property!`)
      }
    }
    
    return context;
  }

  getClassName() {
    return this.constructor.name;
  }
}

module.exports = Assignment;
