const Expression = require('./expression');
const Multary = require('./multary.js');

describe('Multary', () => {
  it('Should be sucess get all valid operands of multary', () => {
    const operators = Expression.getOperators(Multary);

    expect(operators.length).toBeGreaterThan(0);
    for (let operator of operators) {
      expect(typeof Multary[operator]).toBe('string');
    }
  });

  it('Should be success generate "and", "or" expression (multary)', () => {
    const operators = Expression.getOperators(Multary);

    for (let operator of operators) {
      const type = Multary[operator];

      expect(new Multary(type)).toBeInstanceOf(Multary);
    }
  });

  it('should be error generate invalid multary expression', () => {
    expect(() => new Multary('!')).toThrowError('Invalid multary "operator"');
  });
});