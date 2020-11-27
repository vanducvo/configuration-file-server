const Expression = require("./expression");

class Multary extends Expression {
  static AND = 'and';
  static OR = 'or';


  constructor(operator, operands) {
    super();
    if (!Expression.isValidOperator(operator, Multary)) {
      throw new Error('Invalid multary "operator"');
    }

    this._operator = operator;
    this._operands = operands;
  }
}

module.exports = Multary;
