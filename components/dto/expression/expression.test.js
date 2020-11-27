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

    it('should be check literal true', () => {
      const literals = [1, 1.1, '1', true, false, null];
      const noLiterals = [{}, undefined];

      for(let value of literals){
        expect(Expression.isLiteral(value)).toBeTruthy();
      }

      for(let value of noLiterals){
        expect(Expression.isLiteral(value)).toBeFalsy();
      }
    });
  });
});