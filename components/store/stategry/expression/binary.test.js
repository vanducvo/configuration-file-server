const Expression = require('./expression');
const Binary = require('./binary.js');
const Literal = require('./literal');

describe('Binary', () => {
  it('Should be sucess get all valid operands of binary', () => {
    const operators = Expression.getOperators(Binary);

    expect(operators.length).toBeGreaterThan(0);
    for (let operator of operators) {
      expect(typeof Binary[operator]).toBe('string');
    }
  });

  it('Should be success generate "eq", "ne" "gt", "lt", "ge", "le" expression (binary)', () => {
    const operators = Expression.getOperators(Binary);

    for (let operator of operators) {
      const type = Binary[operator];

      expect(new Binary(type, new Literal(1), new Literal(2))).toBeInstanceOf(Binary);
    }
  });

  it('should be error generate invalid binary expression', () => {
    const message = 'Invalid binary "operator"';
    expect(() => new Binary('!')).toThrowError(message);
  });

  it('should be error generate invalid operand', () => {
    const message = 'Invalid operand, must be instance of Expression';
    expect(() => new Binary(
      Binary.GREATHAN, 1,
      new Literal(1))
    ).toThrowError(message);

    expect(() => new Binary(
      Binary.GREATHAN,
      new Literal(1), 1)
    ).toThrowError(message);
  });

  it('should evaluate', () => {
    const context = {};
    const operators = Expression.getOperators(Binary);
    const compare = (a, op, b) => {
      switch (op) {
        case Binary.EQUAL:
          return a === b;
        case Binary.NOT_EQUAL:
          return a !== b;
        case Binary.GREATHAN:
          return a > b;
        case Binary.GREATHAN_OR_EQUAL:
          return a >= b;
        case Binary.LESSTHAN:
          return a < b;
        case Binary.LESSTHAN_OR_EQUAL:
          return a <= b;
      }
    }

    for (let operator of operators) {
      const expression = new Binary(
        Binary[operator],
        new Literal(30),
        new Literal(10)
      );

      expect(expression.evaluate(context)).toEqual(compare(30, Binary[operator], 10));
    }
  });
});
