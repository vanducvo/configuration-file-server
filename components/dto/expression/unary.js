const Expression = require("./expression");

class Unary extends Expression {
  static NOT = 'not';

  constructor(operator, operand) {
    if (!Expression.isValidOperator(operator, Unary)) {
      throw new Error('Invalid unary "operator"');
    }

    if (!(operand instanceof Expression)) {
      throw new Error('Invalid operand, must be instance of Expression');
    }

    super();
    this._operator = operator;
    this._operand = operand;
  }

  evaluate(context) {
    switch (this._operator) {
      case Unary.NOT:
        return !this._operand.evaluate(context);
    }
  }
}

module.exports = Unary;
