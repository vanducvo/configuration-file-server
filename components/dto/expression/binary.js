const Expression = require("./expression");

class Binary extends Expression {
  static GREATHAN = 'gt';
  static GREATHAN_OR_EQUAL = 'ge';
  static LESSTHAN = 'lt';
  static LESSTHAN_OR_EQUAL = 'le';
  static EQUAL = 'eq';
  static NOT_EQUAL = 'ne';

  constructor(operator, leftOperand, rightOperand) {
    if (!Expression.isValidOperator(operator, Binary)) {
      throw new Error('Invalid binary "operator"');
    }

    super();
    this._operator = operator;
    this._leftOperand = leftOperand;
    this._rightOperand = rightOperand;
  }
}

module.exports = Binary;