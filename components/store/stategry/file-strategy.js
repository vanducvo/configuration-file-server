const fs = require('fs');
const path = require('path');
const v8 = require('v8');
const util = require('util');

const StrategyStore = require('./strategy-store.js');

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

  static decode(buffer) {
    return v8.deserialize(buffer);
  }

  static appendConfiguration(store, configuration) {
    store.data.push({ id: store.lastIndex, ...configuration });

    store.lastIndex++;
    store.length++;

    return store;
  }

  static encode(store) {
    return v8.serialize(store);
  }

  static makeStoreDefault() {
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
  
  static isValidCondition(condition) {
    const properties = Object.getOwnPropertyNames(condition);
    return properties.includes('userId') && properties.length > 0;
  }
  
  static deleteConfiguration(store, condition) {
    let remainingData = [];


    for (let configuration of store.data) {
      try {
        const expression = Expression.parseFromJSON(condition);
        const isMatch = expression.evaluate(configuration);
        if (!isMatch) {
          remainingData.push(configuration);
        }
      } catch (exception) {
        // Ignore, like is not match.
      }
    }

    store.data = remainingData;
    store.length = remainingData.length;

    return store;
  }

  wasExistedStore(filename) {
    const filePath = this.getFilePath(filename);
    return fs.existsSync(filePath);
  }

  getFilePath(filename) {
    return path.join(this._path, filename);
  }

  async getNumberOfAllConfigurations(userId) {
    const filename = FileStrategy.getFileName(userId);

    if (!this.wasExistedStore(filename)) {
      return 0;
    }

    const store = await this.getStore(filename);

    return store.length;
  }

  async getStore(filename) {
    const filePath = this.getFilePath(filename);
    const buffer = await readFile(filePath);

    const configurations = FileStrategy.decode(buffer);

    return configurations;
  }

  async select(condition) {
    if (!FileStrategy.isValidCondition(condition)) {
      throw new Error('Must have userId constraint!');
    }

    const { userId, ...subCondition } = condition;

    const filename = FileStrategy.getFileName(userId);
    const configurations = await this.getStore(filename);

    let results = [];
    for (let child of configurations.data) {
      let expression = Expression.parseFromJSON(subCondition)

      try {
        const isMatch = expression.evaluate(child);
        if (isMatch) {
          results.push(child);
        }
      } catch (exception) {
        // Ignore, like is not match.
      }

    }

    return results;
  }

  async insert(configuration) {
    if (!FileStrategy.isValidConfiguration(configuration)) {
      throw new Error('Must have userId and least one property!');
    }

    const { userId, ...configurationOfUser } = configuration;

    const filename = FileStrategy.getFileName(userId);

    let store = null;
    if (this.wasExistedStore(filename)) {
      store = await this.getStore(filename);
    } else {
      store = FileStrategy.makeStoreDefault();
    }

    store = FileStrategy.appendConfiguration(store, configurationOfUser);

    await this.saveStore(filename, store);
  }


  async saveStore(filename, store) {
    const pathOfFile = this.getFilePath(filename);
    const content = FileStrategy.encode(store);
    await writeFile(pathOfFile, content);
  }


  async update(assignments, condition) {
    throw new Error('Method Not Implmentent!');
  }

  async delete(condition) {
    if (!FileStrategy.isValidCondition(condition)) {
      throw new Error('Must have userId constraint!');
    }

    const { userId, ...subCondition } = condition;

    const filename = FileStrategy.getFileName(userId);

    if (!this.wasExistedStore(filename)) {
      throw new Error('Configuration not exsist!');
    }

    let store = await this.getStore(filename);
    const oldLength = store.length;

    store = FileStrategy.deleteConfiguration(store, subCondition);

    await this.saveStore(filename, store);

    const deletedConfigurationNumber = oldLength - store.length;
    return deletedConfigurationNumber;
  }
}

module.exports = FileStrategy;
