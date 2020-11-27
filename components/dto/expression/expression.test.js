const Expression = require('./expression.js');
const Binary = require('./binary.js');
const Unary = require('./unary.js');
const Id = require('./id.js');
const Multary = require('./multary.js');
const Literal = require('./literal.js');

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
});