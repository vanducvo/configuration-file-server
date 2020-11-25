const Condition = require('./condition.js');

describe('Single Query Class', () => {
  const query = 'user.name=2|user.age>1';

  it('should have constructor with query argument', () => {
    const condition = new Condition(query);

    expect(condition).toBeInstanceOf(Condition);
  });

  it('should have get path', () => {
    const condition = new Condition(query);

    expect(condition.getQuery()).toEqual(query);
  });

  it('should have set path', () => {
    const condition = new Condition(query);
    const newQuery = query + "&user.getMarried=false";

    condition.setQuery(newQuery);

    expect(condition.getQuery()).toEqual(newQuery);
  });

});
