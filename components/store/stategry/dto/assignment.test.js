const Assignment = require('./assignment.js');

describe('Change Class', () => {
  it('can constructor with default arguments', () => {
    const assignment = new Assignment({ name: 'duc' });

    expect(assignment).toBeInstanceOf(Assignment);
  });

  it('should throw error when invalid properties', () => {
    const invalidProperties = [1, 1.1, '1.1', null, NaN, undefined, { _id: 0 }, {}];

    let message = Assignment.name +
      ': properties is object and _id is immutable';
    for (let properties of invalidProperties) {
      expect(() => {
        new Assignment(properties)
      }).toThrowError()
    }
  });

  it('can update property', () => {
    const context = {
      user: 'sudo',
      age: 21
    }
    const properties = {
      user: 'brew'
    };
    const assignment = new Assignment(
      properties
    );

    expect(assignment.apply(context)).toEqual({ ...context, ...properties });
  });

  it('can delete property', () => {
    const context = {
      user: 'sudo',
      age: 21
    }
    const properties = {
      user: undefined
    };
    const assignment = new Assignment(
      properties
    );

    expect(assignment.apply(context)).toEqual({ age: context.age });
  });

  it('should throw when invalid wrong', () => {
    const invalidContexts = [1, 1.1, '1.1', null, NaN, undefined];
    const properties = {
      user: 'brew'
    };
    const assignment = new Assignment(
      properties
    );

    const message = Assignment.name + ':apply context must be object';
    for (let context of invalidContexts) {
      expect(() => {
        assignment.apply(context);
      }).toThrowError(message)
    }
  });

  it('can get properties', () => {
    const properties = {
      getMarried: false
    };

    const assignment = new Assignment(
      properties
    );

    expect(assignment.getProperties()).toEqual(properties);
  });

  it('can get properties', () => {
    const properties = {
      getMarried: false
    };

    const assignment = new Assignment(
      properties
    );

    expect(assignment.getProperties()).toEqual(properties);
  });
});
