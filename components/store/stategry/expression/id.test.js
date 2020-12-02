const Id = require('./id.js')

describe('Id', () => {
  const idCommonContext = {
    user: {
      name: {
        firstname: 'su',
        lastname: 'do'
      },
      age: 30
    },
    id: 0
  };

  it('Should generate sucess', () => {
    expect(new Id('id')).toBeInstanceOf(Id);
    expect(new Id('user.name')).toBeInstanceOf(Id);
  });

  it('Should generate fail with invalid name', () => {
    expect(() => new Id('####')).toThrowError('Invalid name');
    expect(() => new Id('user.name.')).toThrowError('Invalid name');
  });

  it('should evaluate', () => {
    const context = { ...idCommonContext }
    expect(new Id("id").evaluate(context)).toEqual(0);
    expect(new Id("user.name.lastname").evaluate(context)).toEqual('do');
  });

  it('should throw Error Context Empty', () => {
    const id = new Id("id");

    const emptyContexts = [null, undefined, {}, 1, 1.1, '1', true, false];
    const message = 'Context Empty';
    for (let context of emptyContexts) {
      expect(() => id.evaluate(context)).toThrowError(message);
    }

  });

  it('should throw Error Not found property in context', () => {
    const id = new Id("user.age.a");
    const message = 'Not found property in context';
    const context = { ...idCommonContext };

    expect(() => id.evaluate(context)).toThrowError(message);
  });

  it('should throw Error Property evaluate must be literal', () => {
    const id = new Id("user.name");
    const message = 'Property evaluate must be literal';
    const context = { ...idCommonContext };

    expect(() => id.evaluate(context)).toThrowError(message);
  });
});
