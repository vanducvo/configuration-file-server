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

    if (this._isOperandInvalid(leftOperand, rightOperand)) {
      throw new Error('Invalid operand, must be instance of Expression');
    }

    this._operator = operator;
    this._leftOperand = leftOperand;
    this._rightOperand = rightOperand;
  }

  _isOperandInvalid(leftOperand, rightOperand) {
    return !(leftOperand instanceof Expression)
      || !(rightOperand instanceof Expression);
  }

  evaluate(context) {
    const left = this._leftOperand.evaluate(context);
    const right = this._rightOperand.evaluate(context);

    switch (this._operator) {
      case Binary.EQUAL:
        return left === right;
      case Binary.NOT_EQUAL:
        return left !== right;
      case Binary.GREATHAN:
        return left > right;
      case Binary.GREATHAN_OR_EQUAL:
        return left >= right;
      case Binary.LESSTHAN:
        return left < right;
      case Binary.LESSTHAN_OR_EQUAL:
        return left <= right;
    }
  }
}

module.exports = Binary;