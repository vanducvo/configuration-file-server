const fs = require('fs');
const path = require('path');
const v8 = require('v8');
const util = require('util');

const StrategyStore = require('./strategy-store.js');
const Enviroment = require('../enviroment/index');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const Expression = require('./expression');

class FileStrategy extends StrategyStore {

  constructor(path) {
    super();
    this._path = path;
  }

  static getFileName(userId) {
    return userId + '-configurations.json';
  }

  wasExistedConfigurationFile(filename) {
    const filePath = this.getFilePath(filename);
    return fs.existsSync(filePath);
  }

  getFilePath(filename) {
    return path.join(this._path, filename);
  }

  async getNumberOfAllConfigurations(userId) {
    const filename = FileStrategy.getFileName(userId);

    if (!this.wasExistedConfigurationFile(filename)) {
      return 0;
    }

    const configurations = await this.getAllConfigurations(filename);

    return configurations.length;
  }

  async getAllConfigurations(filename) {
    const filePath = this.getFilePath(filename);
    const buffer = await readFile(filePath);

    const configurations = this.bufferToJSON(buffer);

    return configurations;
  }

  bufferToJSON(buffer) {
    return v8.deserialize(buffer);
  }


  async select(condition) {
    const {userId, ...subCondition} = condition;
    if(!userId){
      throw new Error('Must have userId constraint!');
    }

    const filename = FileStrategy.getFileName(userId);
    const configurations = await this.getAllConfigurations(filename);

    let results = [];
    for (let child of configurations.data) {
      let expression = Expression.parseFromJSON(subCondition)

      try {
        const isMatch = expression.evaluate(child);
        if (isMatch) {
          results.push(child);
        }
      }catch(exception){
        // Logger Need To Here
      }

    }

    return results;
  }

  async insert(configuration) {
    const {userId, ...subConfiguration} = configuration;
    if(!FileStrategy.isValidConfiguration(configuration)){
      throw new Error('Must have userId and least one property!');
    }

    const filename = FileStrategy.getFileName(userId);
    
    let configurations = null;
    if(!this.wasExistedConfigurationFile(filename)){
      configurations = FileStrategy.makeConfigurationsDedault();
    }

    configurations.data.push({id: configurations.lastIndex, ...subConfiguration});

    configurations.lastIndex++;
    configurations.length++;

    await writeFile(this.getFilePath(filename), v8.serialize(configurations));
  }

  static makeConfigurationsDedault() {
    return {
      length: 0,
      lastIndex: 0,
      data: []
    };
  }

  static isValidConfiguration(configuration) {
    const properties = Object.getOwnPropertyNames(configuration);
    return properties.includes('userId') && properties.length > 1;
  }

  update(assignments, condition) {
    throw new Error('Method Not Implmentent!');
  }

  delete(condition) {
    throw new Error('Method Not Implmentent!');
  }
}

module.exports = FileStrategy;
