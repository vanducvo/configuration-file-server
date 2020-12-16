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

  afterEach(() => {
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



  it('can get file path (valid)', () => {
    setEnviromentStoreType(StoreTypes.FILE);
    
    setEnviromentFilePath(path);

    const storeType = Enviroment.getFilePath();

    expect(storeType).toEqual(path);
  });

  it('can get file path (invalid)', () => {
    setEnviromentStoreType(StoreTypes.MYSQL);

    setEnviromentFilePath(path);

    expect(() => Enviroment.getFilePath()).toThrowError();
  });

    it('can get file limit configurations', () => {
      setEnviromentStoreType(StoreTypes.FILE);

      const limit = 100000;
      setEnviromentFileLimitConfiguration(limit);

      expect(Enviroment.getFileLimitConfiguration()).toEqual(100000);
    });

    it('should throw error if Store type no equal FILE', () => {
      setEnviromentStoreType(StoreTypes.MONGODB);

      expect(() => Enviroment.getFileLimitConfiguration()).toThrowError()
    });

    it('can get MySQL URL CONNECTION', () => {
      setEnviromentStoreType(StoreTypes.MYSQL)
      const uri = 'mysql://configuration:88888888@localhost:3306/configuration';
      setEnviromentMySQLURI(uri);

      expect(Enviroment.getMySQLURI()).toEqual(uri)
    });
});

function setEnviromentMySQLURI(uri) {
  process.env.MYSQL_URI = uri;
}

function setEnviromentFileLimitConfiguration(limit) {
  process.env.FILE_LIMIT_CONFIGURATION = limit;
}

function setEnviromentFilePath(path) {
  process.env.FILE_PATH = path;
}

function setEnviromentStoreType(type) {
  process.env.STORE_TYPE = type;
}
