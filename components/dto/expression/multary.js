const Binary = require("./binary");
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

  _evaluateAND(context) {
    let result = true;
    for(let operand of this._operands){
      result = result && operand.evaluate(context);

      if(result === false){
        return false;
      }
    }

    return result;
  }

  _evaluateOR(context) {
    let result = false;
    for(let operand of this._operands){
      result = result || operand.evaluate(context);

      if(result === true){
        return true;
      }
    }

    return result;
  }

  evaluate(context) {
    switch (this._operator) {
      case Multary.AND:
        return this._evaluateAND(context);
      case Multary.OR:
        return this._evaluateOR(context);
    }
  }
}

module.exports = Multary;
