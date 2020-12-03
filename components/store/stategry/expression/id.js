const Expression = require("./expression");

class Id extends Expression {
  constructor(name) {
    if (!Id.isValidName(name)) {
      throw new Error('Invalid name');
    }

    super();
    this._name = name;
  }

  static isValidName(name) {
    const namePattern = /[_\w\.]+\w+$/;
    return namePattern.test(name);
  }

  static getProperty(path, context) {
    if (Id.isEmpty(context)) {
      throw new Error('Context Empty');
    }

    let steps = path.split('.');
    let value = context;
    for (let step of steps) {
      value = value[step];

      if (value === undefined) {
        throw new Error('Not found property in context');
      }
    }

    if (Expression.isLiteral(value)) {
      return value;
    }

    throw new Error('Property evaluate must be literal');
  }

  static isEmpty(context) {
    return !context
      || Object.keys(context).length === 0
      || typeof (context) == 'string';
  }

  evaluate(context) {
    return Id.getProperty(this._name, context);
  }
}

module.exports = Id;
