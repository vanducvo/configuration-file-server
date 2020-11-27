const Expression = require("./expression");

class Literal extends Expression {
  constructor(value) {
    if (!Expression.isLiteral(value)) {
      throw new Error('Invalid literal');
    }

    super();
    this._value = value;
  }

  evaluate(context) {
    return this._value;
  }
}

module.exports = Literal;
