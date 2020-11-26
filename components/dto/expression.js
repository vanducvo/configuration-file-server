class Expression {
  static getOperators(type){
    return Object.keys(type);
  }

  static isValidOperator(operator, type) {
    const existsOperators = Object.values(type);
    return existsOperators.includes(operator);
  }

  evaluate(context){};
}

class Unary extends Expression {
  static NOT = 'not';
  
  constructor(operator, operand) {
    if(!Expression.isValidOperator(operator, Unary)){
      throw new Error('Invalid unary "operator"');
    }

    super();
    this._operator = operator;
    this._operand = operand;
  }

  evaluate(context){

  }
}

class Binary extends Expression {
  static GREATHAN = 'gt';
  static GREATHAN_OR_EQUAL = 'ge';
  static LESSTHAN = 'lt';
  static LESSTHAN_OR_EQUAL = 'le';
  static EQUAL = 'eq';
  static NOT_EQUAL = 'ne';

  constructor(operator, leftOperand, rightOperand) {
    if(!Expression.isValidOperator(operator, Binary)){
      throw new Error('Invalid binary "operator"');
    }
  
    super();
    this._operator = operator;
    this._leftOperand = leftOperand;
    this._rightOperand = rightOperand;
  }
}

class Multary extends Expression {
  static AND = 'and';
  static OR = 'or';


  constructor(operator, operands){
    super();
    if(!Expression.isValidOperator(operator, Multary)){
      throw new Error('Invalid multary "operator"');
    }

    this._operator = operator;
    this._operands = operands;
  }
}

class Id extends Expression{
  constructor(name){
    if(!Id.isValidName(name)){
      throw new Error('Invalid name');
    }

    super();
    this._name = name;
  }

  static isValidName(name) {
    const namePattern = /[\w\.]+\w+$/;
    return namePattern.test(name);
  }

  static getProperty(path, context){
    if(Id.isEmpty(context)){
      throw new Exception('Context Empty');
    }

    let steps = path.split('.');
    let value = context;
    for(let step of steps){
      value = value[step];

      if(value === undefined){
        throw new Error('Not found property in context');
      }
    }

    if(Literal.isLiteral(value)){
      return value;
    }

    throw new Error('Property evaluate must be literal');
  }

  static isEmpty(context) {
    return !context || Object.keys(context).length === 0;
  }

  evaluate(context){
    return Id.getProperty(this._name, context);
  }
}

class Literal extends Expression {
  static isLiteral(operand){
    switch(typeof operand){
      case 'string':
      case 'number':
      case 'boolean':
        return true;
      default:
        if(operand === null){
          return true;
        }

        return false;
    }
  }

  constructor(value){
    if(!Literal.isLiteral(value)){
      throw new Error('Invalid literal');
    }

    super();
    this._value = value;
  }

  evaluate(context){
    return this._value;
  }
}

module.exports = {
  Expression,
  Unary,
  Binary,
  Multary,
  Id,
  Literal
};
