const Configuration = require('./configuration.js');
const User = require('./user.js');

describe('Configure Class', () => {
  const user = new User(0, 'tester');
  const info = {
    name: 'Sudoers',
    age: 30
  };

  it('should have constructor with no parameter', () => {
    const configuration = new Configuration();
    
    expect(configuration).toBeInstanceOf(Configuration);
  });


  it('should have constructor with user, config arguments', () => {
    const configuration = new Configuration(user, info);
    
    expect(configuration).toBeInstanceOf(Configuration);
  });

  it('should have get config', () => {
    const configuration = new Configuration(user, info);
    
    expect(configuration.getConfig()).toEqual(info);
  });

  it('should have set config', () => {
    const configuration = new Configuration();
    
    configuration.setConfig(info);
    
    expect(configuration.getConfig()).toEqual(info);
  });

  it('should have get user', () => {
    const configuration = new Configuration(user, info);
    
    expect(configuration.getUser()).toEqual(user);
  });

  it('should have set user', () => {
    const configuration = new Configuration
  });

  it('should have deep copy config when intital', () => {
    let complexInfo = {
      name: 'Sudoers',
      age: {
        solarCalendar: 30,
        lunarCalendar: 31
      }
    };
    
    const configuration = new Configuration(complexInfo);
    complexInfo.age.complexInfo = 31;

    expect(configuration.getConfig()).not.toEqual(complexInfo);
  });

  it('should have deep copy config when set config', () => {
    let complexInfo = {
      name: 'Sudoers',
      age: {
        solarCalendar: 30,
        lunarCalendar: 31
      }
    };
    const newsolarCalendar = 31

    const configuration = new Configuration();
    configuration.setConfig(complexInfo);
    complexInfo.age.solarCalendar = newsolarCalendar;

    expect(configuration.getConfig.solarCalendar).not.toEqual(newsolarCalendar);
  });
});
