const {
  Enviroment,
  StoreTypes
} = require('./index.js');

describe('Enviroment Components', () => {

  const OLD_ENV = process.env;
  const path = '/root';

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Get store type (valid)', () => {

    for(let type of StoreTypes.getAllStoreType()){
      setEnviromentStoreType(StoreTypes[type]);
  
      const storeType = Enviroment.getStoreType();
  
      expect(storeType).toEqual(StoreTypes[type]);
    }

  });

  it('Get store type (invalid)', () => {
    setEnviromentStoreType("postgres");

    expect(() => Enviroment.getStoreType()).toThrowError();
  });



  it('should have get file path (valid)', () => {
    setEnviromentStoreType(StoreTypes.FILE);
    
    setEnviromentFilePath(path);

    const storeType = Enviroment.getFilePath();

    expect(storeType).toEqual(path);
  });

  it('should have get file path (invalid)', () => {
    setEnviromentStoreType(StoreTypes.MYSQL);

    setEnviromentFilePath(path);

    expect(() => Enviroment.getFilePath()).toThrowError();
  });
});

function setEnviromentFilePath(path) {
  process.env.FILE_PATH = path;
}

function setEnviromentStoreType(type) {
  process.env.STORE_TYPE = type;
}
