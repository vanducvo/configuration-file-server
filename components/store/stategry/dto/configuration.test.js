const Configuration = require('./configuration.js');

describe('Configure Class', () => {

  it('can create configuaration', () => {
    const configuration = new Configuration({ _userId: 0, names: 'sudoers' });

    expect(configuration).toBeInstanceOf(Configuration);
  });

  it('should throw errors when properties invalid', () => {
    const message = Configuration.name +
      ': properties is object and userID is integer number'

    expect(() => {
      new Configuration({ names: 'sudoers' });
    }).toThrowError(message);
  });

  it('should have get config', () => {
    const properties = { _userId: 0, names: 'sudoers' };
    const configuration = new Configuration(properties);

    const config = { names: 'sudoers' };
    expect(configuration.getConfig()).toEqual(config);
  });


  it('should have get user id', () => {
    const properties = { _userId: 0, names: 'sudoers' };
    const configuration = new Configuration(properties);


    expect(configuration.getUserId()).toEqual(properties._userId);
  });



  it('should have deep copy config when intital', () => {
    let properties = {
      _userId: 0,
      name: 'Sudoers',
      age: {
        solarCalendar: 30,
        lunarCalendar: 31
      }
    };

    const configuration = new Configuration(properties);
    properties.age.complexInfo = 31;

    expect(configuration.getConfig()).not.toEqual(properties);
  });
});
