const Literal = require('./literal.js');
const Id = require('./id.js');
const Unary = require('./unary.js');
const Binary = require('./binary.js');
const Multary = require('./multary.js');
const Expression = require('./expression.js');

function parseFromJSON(json) {
  let operators = Object.keys(json);
  if (operators.length !== 1) {
    throw new Error('Format Wrong, Please check syntax again');
  }

  try {
    return parse(json);
  } catch (error) {
    throw error;
  }

}

function parse(json) {
  if (Expression.isLiteral(json)) {
    return parseLiteral(json);
  }

  const error = new Error('Format Wrong, Please check syntax again');

  const operators = Object.keys(json);
  if (operators.length !== 1) {
    throw error;
  }

  const operator = operators[0];

  if (Expression.isValidOperator(operator, Unary)) {
    const operand = json[operator];
    return parseUnary(operator, operand);
  } else if (Expression.isValidOperator(operator, Binary)) {
    const name = json[operator][0];
    const operand = json[operator][1];
    return parseBinary(operator, name, operand);
  } else if (Expression.isValidOperator(operator, Multary)) {
    const operands = json[operator];
    return parseMultary(operator, operands);
  } else {
    throw error;;
  }
}

function parseLiteral(value) {
  if (!Expression.isLiteral(value)) {
    throw new Error('Invalid type of value');
  }

  return new Literal(value);
}

function parseId(name) {
  if (Expression.isInvalidName(name)) {
    throw new Error('Invalid name');
  }
  return new Id(name);
}

function parseUnary(operator, operand) {
  const expression = parse(operand);
  return new Unary(operator, expression);
}

function parseBinary(operator, name, operand) {
  const expression = parse(operand);
  const id = parseId(name);
  return new Binary(operator, id, expression);
}

function parseMultary(operator, operands) {
  let expressions = [];
  for (let operand of operands) {
    expressions.push(parse(operand));
  }

  return new Multary(operator, expressions)
}

module.exports = {
  parseFromJSON,
  parseId,
  parseLiteral,
  parseUnary,
  parseBinary,
  parseMultary,
  parse
};
