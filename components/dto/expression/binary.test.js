const Expression = require('./expression');
const Binary = require('./binary.js');

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

      expect(new Binary(type)).toBeInstanceOf(Binary);
    }
  });

  it('should be error generate invalid binary expression', () => {
    expect(() => new Binary('!')).toThrowError('Invalid binary "operator"');
  });
});
