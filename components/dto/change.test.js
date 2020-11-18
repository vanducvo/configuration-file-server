const Change = require('./change.js');

describe('Change Class', () => {
  const path = 'user.name';
  const value = 10;

  it('should have constructor with default arguments', () => {
    const change = new Change(path , value);

    expect(change).toBeInstanceOf(Change);
  });

  it('should have constructor with all arguments', () => {
    const change = new Change(path, value, true);

    expect(change).toBeInstanceOf(Change);
  });

  it('should have get path', () => {
    const change = new Change(path, value);

    expect(change.getPath()).toEqual(path);
  });

  it('should have set path', () => {
    const change = new Change(path, value); 
    const newPath = path + ".new";

    change.setPath(newPath);

    expect(change.getPath()).toEqual(newPath);
  });

  it('should have get value', () => {
    const change = new Change(path, value);

    expect(change.getValue()).toEqual(value);
  });

  it('should have set value', () => {
    const change = new Change(path, value);
    const newValue = value + 10;

    change.setValue(newValue);

    expect(change.getValue()).toEqual(newValue);
  });

  it('should have is delete', () => {
    const change = new Change(path, value);

    expect(change.isDelete()).toBeFalsy();
  });

  it('should have is delete', () => {
    const change = new Change(path, value);

    expect(change.isDelete()).toBeFalsy();

    change.setDelete(true);

    expect(change.isDelete()).toBeTruthy();
  });

});