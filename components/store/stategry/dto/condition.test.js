const Condition = require('./condition.js');

describe('Condition', () => {
  it('can create Condition', () => {
    const properties = { _userId: 1, isDelete: false };
    const conditon = new Condition(properties);

    expect(conditon).toBeInstanceOf(Condition);
  });

  it('can get user id', () => {
    const properties = { _userId: 1, isDelete: false };
    const conditon = new Condition(properties);

    expect(conditon.getUserId()).toEqual(1);
  });

  it('can check condition with context', () => {
    const properties = { _userId: 1, isDelete: false };
    const conditon = new Condition(properties);

    const context = { name: 'sudo', isDelete: false };

    expect(conditon.checkWith(context)).toBeTruthy();
  });

  it('should false when property have not got context', () => {
    const properties = { _userId: 1, acx: false };

    const conditon = new Condition(properties);

    const context = { name: 'sudo', isDelete: false };

    expect(conditon.checkWith(context)).toBeFalsy();
  });

  it('should throw error when invalid properties condition', () => {
    const message = Condition.name +
      ': properties is object and userID is integer number';
    const invalidProperties = [{}];

    const _userId = 1;
    for (const properties of invalidProperties) {
      expect(() => {
        new Condition({});
      }).toThrowError(message);
    }
  });

  it('should throw error when invalid userId condition', () => {
    const message = Condition.name +
      ': properties is object and userID is integer number';
    const invalidUserId = [1.1, '1.1', null, undefined, NaN, {}];

    for (const userId of invalidUserId) {
      expect(() => {
        new Condition({ _userId: userId });
      }).toThrowError(message);
    }
  });

  it('can get properties', () => {
    const properties = {
      _userId: 10,
      getMarried: false,
    };

    const condition = new Condition(
      properties
    );

    const expectProperties = { getMarried: false };
    
    expect(condition.getProperties()).toEqual(expectProperties);
  });
});
