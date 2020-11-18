const SingleQuery = require('./index.js');

describe('Single Query Class', () => {
  const path = 'user.name';
  const value = 'Sudoers';

  it('should have constructor with arguments', () => {
    const query = new SingleQuery(path, value);

    expect(query).toBeInstanceOf(SingleQuery);
  });

  it('should have get path', () => {
    const query = new SingleQuery(path, value);

    expect(query.getPath()).toEqual(path);
  });

  it('should have set path', () => {
    const query = new SingleQuery(path, value);
    const newPath = path + ".new";

    query.setPath(newPath);

    expect(query.getPath()).toEqual(newPath);
  });

  it('should have get value', () => {
    const query = new SingleQuery(path, value);

    expect(query.getValue()).toEqual(value);
  });

  it('should have set value', () => {
    const query = new SingleQuery(path, value);
    const newValue = value + 10;

    query.setValue(newValue);

    expect(query.getValue()).toEqual(newValue);
  });
});