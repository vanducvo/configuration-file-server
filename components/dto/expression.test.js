const {
  Expression,
  Unary,
  Binary,
  Multary,
  Id,
  Literal
} = require('./expression.js');

describe('Expression Components', () => {
  describe('Expression', () => {
    it('Should generate expression', () => {
      const expression = new Expression();
      expect(expression).toBeInstanceOf(Expression);
    });

    it('should have evaluate function', () => {
      const expression = new Expression();
      expect(expression.evaluate).toBeInstanceOf(Function);
    });
  });

  describe('Unary', () => {
    it('Should be sucess get all valid operands of unary', () => {
      const operators = Expression.getOperators(Unary);

      expect(operators.length).toBeGreaterThan(0);
      for (let operator of operators) {
        expect(typeof Unary[operator]).toBe('string');
      }
    });

    it('Should be sucess generate "not" expression (unary)', () => {
      const operators = Expression.getOperators(Unary);

      for (let operator of operators) {
        const type = Unary[operator];
        expect(new Unary(type)).toBeInstanceOf(Unary);
      }
    });

    it('should be error generate invalid unary expression', () => {
      expect(() => new Unary('*')).toThrowError('Invalid unary "operator"');
    });
  });

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

  describe('Id', () => {
    it('Should generate sucess', () => {
      expect(new Id('id')).toBeInstanceOf(Id);
      expect(new Id('user.name')).toBeInstanceOf(Id);
    });

    it('Should generate fail with invalid name', () => {
      expect(() => new Id('####')).toThrowError('Invalid name');
      expect(() => new Id('user.name.')).toThrowError('Invalid name');
    });

    it('should evaluate', () => {
      const context = {
        user: {
          name: {
            firstname: 'su',
            lastname: 'do'
          },
          age: 30
        },
        id: 0
      };

      expect(new Id("id").evaluate(context)).toEqual(0);
      expect(new Id("user.name.lastname").evaluate(context)).toEqual('do');
    });
  });

  describe('Literal', () => {
    it('Should generate sucess', () => {
      expect(new Literal(1)).toBeInstanceOf(Literal);
      expect(new Literal(1.1)).toBeInstanceOf(Literal);
      expect(new Literal('1')).toBeInstanceOf(Literal);
      expect(new Literal(true)).toBeInstanceOf(Literal);
      expect(new Literal(null)).toBeInstanceOf(Literal);
      expect(new Literal(false)).toBeInstanceOf(Literal);
    });

    it('Should generate fail with invalid type', () => {
      expect(() => new Literal({})).toThrowError('Invalid literal');
    });

    it('should evaluate', () => {
      const context = {};
      expect(new Literal(1).evaluate(context)).toEqual(1);
      expect(new Literal(1.1).evaluate(context)).toEqual(1.1);
      expect(new Literal('1.1').evaluate(context)).toEqual('1.1');
      expect(new Literal(true).evaluate(context)).toBeTruthy();
      expect(new Literal(false).evaluate(context)).toBeFalsy();
    })
  });
});
