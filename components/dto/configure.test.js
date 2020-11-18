const Configure = require('./configure.js');

describe('Configure Class', () => {
  const info = {
    name: 'Sudoers',
    age: 30
  };

  it('should have constructor with non-parameter', () => {
    const configure = new Configure();
    
    expect(configure).toBeInstanceOf(Configure);
  });

  it('should have constructor with config parameter', () => {
    const configure = new Configure(info);
    
    expect(configure).toBeInstanceOf(Configure);
  });

  it('should have get config', () => {
    const configure = new Configure(info);
    
    expect(configure.getConfig()).toEqual(info);
  });

  it('should have set config', () => {
    const configure = new Configure();
    
    configure.setConfig(info);
    
    expect(configure.getConfig()).toEqual(info);
  });

  it('should have deep copy config when intital', () => {
    let complexInfo = {
      name: 'Sudoers',
      age: {
        solarCalendar: 30,
        lunarCalendar: 31
      }
    };
    
    const configure = new Configure(complexInfo);
    complexInfo.age.complexInfo = 31;

    expect(configure.getConfig()).not.toEqual(complexInfo);
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

    const configure = new Configure();
    configure.setConfig(complexInfo);
    complexInfo.age.solarCalendar = newsolarCalendar;

    expect(configure.getConfig.solarCalendar).not.toEqual(newsolarCalendar);
  });
});