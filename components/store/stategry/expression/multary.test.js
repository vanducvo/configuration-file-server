const Binary = require('./binary');
const Expression = require('./expression');
const Literal = require('./literal');
const Multary = require('./multary.js');
const Unary = require('./unary');

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

      expect(new Multary(type, [])).toBeInstanceOf(Multary);
    }
  });

  it('should be error generate invalid multary operator', () => {
    const message = 'Invalid multary "operator"';
    expect(() => new Multary('!')).toThrowError(message);
  });

  it('should be error generate invalid multary operand', () => {
    const message = 'Invalid operand, must be instance of Expression';
    expect(() => new Multary(Multary.OR, [new Literal(1), 1])).toThrowError(message);
  });

  describe('should evaluate', () => {
    it('AND - true', () => {
      const expression = new Multary(Multary.AND, [
        new Literal(true), 
        new Unary(Unary.NOT, new Literal(false)),
        new Binary(Binary.GREATHAN, new Literal(3), new Literal(2))
      ])
      expect(expression.evaluate({})).toBeTruthy();
    });

    it('AND - false', () => {
      const expression = new Multary(Multary.AND, [
        new Literal(true), 
        new Binary(Binary.GREATHAN, new Literal(1), new Literal(2)),
        new Unary(Unary.NOT, new Literal(false)),
      ])
      expect(expression.evaluate({})).toBeFalsy();
    });

    it('OR - true', () => {
      const expression = new Multary(Multary.OR, [
        new Literal(false), 
        new Binary(Binary.GREATHAN, new Literal(3), new Literal(2)),
        new Unary(Unary.NOT, new Literal(true)),
      ]);

      expect(expression.evaluate({})).toBeTruthy();
    });

    it('OR - false', () => {
      const expression = new Multary(Multary.OR, [
        new Literal(false), 
        new Unary(Unary.NOT, new Literal(true)),
        new Binary(Binary.GREATHAN, new Literal(1), new Literal(2))
      ])
      expect(expression.evaluate({})).toBeFalsy();
    });
    
  });
});