const StoreType = {
  FILE: 'file',
  MYSQL: 'mysql',
  MONGODB: 'mongodb'
};

class Enviroment {
  static getStoreType() {
    return process.env.STORE_TYPE;
  }

  static getFilePath() {
    if (process.env.STORE_TYPE == StoreType.FILE) {
      return process.env.FILE_PATH;
    }

    const message = `Enviroment is using Storage Type: 
                    "${process.env.STORE_TYPE}", not "file"`;

    throw new Error(message);
  }
}

module.exports = {
  Enviroment,
  StoreType
};