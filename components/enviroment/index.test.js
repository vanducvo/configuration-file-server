const {
  Enviroment,
  EnviromentType
} = require('./index.js');

describe('Enviroment Components', () => {
  it('should have strategy configure in production Enviroment', () => {
    const env = new Enviroment(EnviromentType.PRODUCTION);
    expect(typeof env.getStrategy()).toBe('string');
  });

  it('should have strategy configure in production Enviroment', () => {
    const env = new Enviroment(EnviromentType.DEVELOPMENT);
    expect(typeof env.getStrategy()).toBe('string');
  });
});