const Expression = require('./expression.js');
const Binary = require('./binary.js');
const Unary = require('./unary.js');
const Id = require('./id.js');
const Multary = require('./multary.js');
const Literal = require('./literal.js');

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
      expect(new Unary(type, new Literal(0))).toBeInstanceOf(Unary);
    }
  });

  it('should be error generate invalid operator', () => {
    expect(() => new Unary('*', new Literal(0))).toThrowError('Invalid unary "operator"');
  });

  it('should be error generate invalid operand', () => {
    const message = 'Invalid operand, must be instance of Expression';

    expect(() => new Unary(Unary.NOT, 1)).toThrowError(message);
  });

  describe('should evaluate (Unary)', () => {

    const commonLiteral = [
      new Literal(1),
      new Literal(1.1),
      new Literal(null),
      new Literal('1'),
      new Literal(true),
      new Literal(false)
    ];

    const commonId = [
      new Id('name.isExists'),
      new Id('name.lastname'),
      new Id('getMarried'),
      new Id('wife'),
      new Id('age'),
      new Id('salary.dolar')
    ];

    const commonContext = {
      name: {
        isExists: true,
        lastname: 'su'
      },
      getMarried: false,
      wife: null,
      age: 30,
      salary: {
        dolar: 33.33
      }
    };

    it('should evaluate for literal', () => {
      const literals = [...commonLiteral];
      const context = {};

      for (let value of literals) {
        expect(new Unary(Unary.NOT, value).evaluate(context)).toEqual(!value.evaluate(context))
      }
    });

    it('should evaluate for id', () => {
      const ids = [...commonId];

      const context = { ...commonContext };

      for (let id of ids) {
        expect(new Unary(Unary.NOT, id).evaluate(context)).toEqual(!id.evaluate(context))
      }
    });

    it('should evaluate for Unary', () => {
      const children = [...commonLiteral, ...commonId];

      const context = { ...commonContext };

      for (let child of children) {
        const expression = new Unary(Unary.NOT, new Unary(Unary.NOT, child));
        expect(expression.evaluate(context)).toEqual(!!child.evaluate(context));
      }

    });

    it('should evalue for Binary - Mock', () => {
      const context = {};
      const binary = new Binary(Binary.GREATHAN, 1, 2);
      const spy = jest.spyOn(binary, 'evaluate').mockImplementation(() => false);
      const expression = new Unary(Unary.NOT, binary);

      expect(expression.evaluate(context));

      spy.mockRestore();
    });

    it('should evalue for Mutaly - Mock', () => {
      const context = {};
      const multary = new Multary(Multary.OR, [true, false]);
      const spy = jest.spyOn(multary, 'evaluate').mockImplementation(() => false);
      const expression = new Unary(Unary.NOT, multary);

      expect(expression.evaluate(context));

      spy.mockRestore();
    });

  });
});
