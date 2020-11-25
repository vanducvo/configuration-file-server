const {
  Enviroment,
  StoreType
} = require('./index.js');

describe('Enviroment Components', () => {

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should have get store type', () => {
    process.env.STORE_TYPE = StoreType.FILE;
  
    const storeType = Enviroment.getStoreType();

    expect(storeType).toEqual(StoreType.FILE);
  });

  it('should have get file path (valid)', () => {
    process.env.STORE_TYPE = StoreType.FILE;
    const path = '/root';
    process.env.FILE_PATH = path;

    const storeType = Enviroment.getFilePath();

    expect(storeType).toEqual(path);
  });

  it('should have get file path (invalid)', () => {
    process.env.STORE_TYPE = StoreType.MYSQL;
    const path = '/root';
    process.env.FILE_PATH = path;


    expect(() => Enviroment.getFilePath()).toThrowError();
  });
});