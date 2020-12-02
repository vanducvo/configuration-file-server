const Expression = require('./expression.js');
const Unary = require('./unary.js');

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

    it('should get oprator', () => {
      expect(Expression.getOperators(Unary).length).toBeGreaterThan(0);
    });

    it('should operator valid', () => {
      expect(Expression.isValidOperator(Unary.NOT, Unary)).toBeTruthy();
    });

    it('should be check valid literal', () => {
      const literals = [1, 1.1, '1', true, false, null];

      for (let value of literals) {
        expect(Expression.isLiteral(value)).toBeTruthy();
      }
    });

    it('should be check invalid literal', () => {
      const noLiterals = [{}, undefined];

      for (let value of noLiterals) {
        expect(Expression.isLiteral(value)).toBeFalsy();
      }
    });

    it('should be check valid name', () => {
      const validNames = ['user', 'user.name', '12user.name1'];

      for (let value of validNames) {
        expect(Expression.isInvalidName(value)).toBeFalsy();
      }
    });

    it('should be check ivalid literal', () => {
      const invalidNames = ['#', '.user', 'user.', 'user!!abc'];

      for (let value of invalidNames) {
        expect(Expression.isLiteral(value)).toBeTruthy();
      }
    });
  });
});