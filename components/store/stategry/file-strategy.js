const fs = require('fs');
const path = require('path');
const v8 = require('v8');
const util = require('util');

const StrategyStore = require('./strategy-store.js');
const Enviroment = require('../enviroment/index');

const readFile = util.promisify(fs.readFile);

class FileStrategy extends StrategyStore {
  
  constructor(path){
    super();
    this._path = path;
  }

  static getFileName(username){
    return username + '-configurations.json';
  }

  wasExistedConfigurationFile(filename){
    const filePath = this.getFilePath(filename);
    return fs.existsSync(filePath);
  }

  getFilePath(filename) {
    return path.join(this._path, filename);
  }

  async getNumberOfAllConfigurations(username){
    const filename = FileStrategy.getFileName(username);

    if(!this.wasExistedConfigurationFile(filename)){
      return 0;
    }

    const filePath = this.getFilePath(filename);

    const buffer = await readFile(filePath);

    const store = this.bufferToJSON(buffer);

    return store.length;
  }

  bufferToJSON(buffer) {
    return JSON.parse(buffer.toString());
  }

  select(condition) {
    throw new Error('Method Not Implmentent!');
  }

  insert(configuration) {
    if(!this.wasExistedConfigurationFile(configuration)){
      throw new Error('Method Not Implmentent!');
    }
  }

  update(assignments) {
    throw new Error('Method Not Implmentent!');
  }

  delete(condition) {
    throw new Error('Method Not Implmentent!');
  }
}

module.exports = FileStrategy;
