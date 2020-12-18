const fs = require('fs');
const path = require('path');
const v8 = require('v8');
const util = require('util');

const StrategyStore = require('../strategy-store.js');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const Condition = require('../dto/condition.js');
const Configuration = require('../dto/configuration.js');
const Assignment = require('../dto/assignment.js');

class FileStrategy extends StrategyStore {

  constructor(path, limit = Infinity) {
    super();
    this._path = path;
    this._limit = limit;
  }

  static getFileName(userId) {
    return userId + '-configurations.json';
  }

  static decode(buffer) {
    return v8.deserialize(buffer);
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

  static appendConfiguration(_store, configuration) {
    let store = v8.deserialize(v8.serialize(_store));

    // _id must after configuration when configuration has _id it will be over ride
    store.data.push({ ...configuration, _id: store.lastIndex });

    store.lastIndex++;
    store.length++;

    return store;
  }

  static deleteConfiguration(_store, condition) {
    let store = v8.deserialize(v8.serialize(_store));
    let remainConfigurations = [];
    let deleteConfigurations = [];

    for (let configuration of store.data) {
      const isMatch = condition.checkWith(configuration);
      if (isMatch) {
        deleteConfigurations.push(configuration);
      } else {
        remainConfigurations.push(configuration);
      }
    }

    store.data = remainConfigurations;
    store.length = remainConfigurations.length;

    return {
      newStore: store,
      deletedConfigurations: deleteConfigurations
    };
  }

  static updatedConfigurations(_store, assignment, condition) {
    const store = v8.deserialize(v8.serialize(_store));
    const configurations = store.data;

    let updatedConfigurations = [];
    for (let i = 0; i < configurations.length; i++) {
      const isMatch = condition.checkWith(configurations[i]);
      if (isMatch) {
        try {
          configurations[i] = assignment.apply(configurations[i]);
          updatedConfigurations.push(configurations[i]);
        } catch (exception) {
          //Ignore
        }
      }
    }

    return {
      newStore: store,
      updatedConfigurations
    };
  }

  wasExistedStore(userId) {
    const filename = FileStrategy.getFileName(userId);
    const filePath = this.getFilePath(filename);
    return fs.existsSync(filePath);
  }

  getFilePath(filename) {
    return path.join(this._path, filename);
  }

  isExceedLimit(store) {
    return store.length >= this._limit;
  }

  async userConfigurationCount(userId) {
    if (!this.wasExistedStore(userId)) {
      return 0;
    }

    const store = await this.getStore(userId);

    return store.length;
  }

  async getStore(userId) {
    const filename = FileStrategy.getFileName(userId);
    const filePath = this.getFilePath(filename);

    let configurations = FileStrategy.makeStoreDefault();
    if(fs.existsSync(filePath)){
      const buffer = await readFile(filePath);

      configurations = FileStrategy.decode(buffer);
    }

    return configurations;
  }

  async saveStore(userId, store) {
    const filename = FileStrategy.getFileName(userId);
    const pathOfFile = this.getFilePath(filename);
    const content = FileStrategy.encode(store);
    await writeFile(pathOfFile, content);
  }

  async select(_condition) {
    const condition = new Condition(_condition);
    const userConfigurations = await this.getStore(condition.getUserId());

    let results = [];
    for (let configuration of userConfigurations.data) {
      let isMatch = condition.checkWith(configuration)

      if (isMatch) {
        results.push(configuration);
      }
    }

    return results;
  }

  async insert(_configuration) {
    const configuration = new Configuration(_configuration);
    const userId = configuration.getUserId();
    let store = await this.getStore(userId);

    if(this.isExceedLimit(store)){
      throw new Error('Exceed Limit Configuarion Each File');
    }

    store = FileStrategy.appendConfiguration(store, configuration.getProperties());
    const id = store.lastIndex - 1;

    await this.saveStore(userId, store);

    return id;
  }

  async update(_assignment, _condition) {
    const assignment = new Assignment(_assignment);
    const condition = new Condition(_condition);

    let store = await this.getStore(condition.getUserId());

    const {
      newStore,
      updatedConfigurations
    } = FileStrategy.updatedConfigurations(store, assignment, condition);

    await this.saveStore(condition.getUserId(), newStore);

    return updatedConfigurations;
  }

  async delete(_condition) {
    const condition = new Condition(_condition);
    const userId = condition.getUserId();

    if (!this.wasExistedStore(userId)) {
      return [];
    }

    let store = await this.getStore(userId);

    const {
      newStore,
      deletedConfigurations
    } = FileStrategy.deleteConfiguration(store, condition);

    await this.saveStore(userId, newStore);

    return deletedConfigurations;
  }
}

module.exports = FileStrategy;
