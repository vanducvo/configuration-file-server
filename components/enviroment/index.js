const StoreTypes = {
  FILE: 'file',
  MYSQL: 'mysql',
  MONGODB: 'mongodb',
  getAllStoreType() {
    return Object.keys(this);
  },
  isValid(type) {
    const existsType = Object.values(this);
    return existsType.includes(type);
  }
};

Object.defineProperties(StoreTypes, {
  getAllStoreType: {
    enumerable: false,
    configurable: false,
    writable: false
  },
  isValid: {
    enumerable: false,
    configurable: false,
    writable: false
  }
});

class Enviroment {
  static getStoreType() {
    const type = process.env.STORE_TYPE;
    if (StoreTypes.isValid(type)) {
      return process.env.STORE_TYPE;
    }

    throw new Error(`Store Type Invalid, it must in ${StoreTypes}`);
  }

  static getFilePath() {
    if (process.env.STORE_TYPE === StoreTypes.FILE) {
      return process.env.FILE_PATH;
    }

    const message = `Enviroment is using Storage Type: 
                    "${process.env.STORE_TYPE}", not "file"`;

    throw new Error(message);
  }

  static getFileLimitConfiguration() {

    if (process.env.STORE_TYPE === StoreTypes.FILE) {
      return process.env.FILE_LIMIT_CONFIGURATION;
    }

    const message = `Enviroment is using Storage Type: 
                    "${process.env.STORE_TYPE}", not "file"`;

    throw new Error(message);
  }

  static getJwtSecret(){
    return process.env.JWT_SECRET;
  }

  static getMySQLURI() {
    return process.env.MYSQL_URI;
  }
}

module.exports = {
  Enviroment,
  StoreTypes
};
