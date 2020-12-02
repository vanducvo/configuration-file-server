const Literal = require('./literal.js');

describe('Literal', () => {
  it('Should generate sucess', () => {
    const literals = [1, 1.1, '1', true, false, null];

    for (let value of literals) {
      expect(new Literal(value)).toBeInstanceOf(Literal);
    }
  });

  it('Should generate fail with invalid type', () => {
    const nonLiteral = [{}, [], undefined];
    const message = 'Invalid literal';

    for (let value of nonLiteral) {
      expect(() => new Literal(value)).toThrowError(message);
    }
  });

  it('should evaluate', () => {
    const context = {};
    const literals = [1, 1.1, '1.1', true, false, null];

    for (let value of literals) {
      expect(new Literal(value).evaluate(context)).toEqual(value);
    }
  })
});