class Expression {
  static getOperators(type) {
    return Object.keys(type);
  }

  static isValidOperator(operator, type) {
    const existsOperators = Object.values(type);
    return existsOperators.includes(operator);
  }

  static isLiteral(operand) {
    switch (typeof operand) {
      case 'string':
      case 'number':
      case 'boolean':
        return true;
      default:
        if (operand === null) {
          return true;
        }

        return false;
    }
  }

  static isInvalidName(name) {
    return typeof (name) !== 'string' || !/^\w[\w\.]*\w$/.test(name);
  }

  evaluate(context) { };
}

module.exports = Expression;
