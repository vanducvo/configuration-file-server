const Assignment = require('./assignment.js');

describe('Change Class', () => {
  const path = 'user.name';
  const value = 10;

  it('should have constructor with default arguments', () => {
    const assignment = new Assignment(path , value);

    expect(assignment).toBeInstanceOf(Assignment);
  });

  it('should have constructor with path, value, isDelete arguments', () => {
    const assignment = new Assignment(path, value, true);

    expect(assignment).toBeInstanceOf(Assignment);
  });

  it('should have get path', () => {
    const assignment = new Assignment(path, value);

    expect(assignment.getPath()).toEqual(path);
  });

  it('should have set path', () => {
    const assignment = new Assignment(path, value); 
    const newPath = path + ".new";

    assignment.setPath(newPath);

    expect(assignment.getPath()).toEqual(newPath);
  });

  it('should have get value', () => {
    const assignment = new Assignment(path, value);

    expect(assignment.getValue()).toEqual(value);
  });

  it('should have set value', () => {
    const assignment = new Assignment(path, value);
    const newValue = value + 10;

    assignment.setValue(newValue);

    expect(assignment.getValue()).toEqual(newValue);
  });

  it('should have is delete', () => {
    const assignment = new Assignment(path, value);

    expect(assignment.isDelete()).toBeFalsy();
  });

  it('should have is delete', () => {
    const assignment = new Assignment(path, value);

    expect(assignment.isDelete()).toBeFalsy();

    assignment.setDelete(true);

    expect(assignment.isDelete()).toBeTruthy();
  });

});
