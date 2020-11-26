const fs = require('fs');
const path = require('path');
const v8 = require('v8');
const util = require('util');

const StrategyStore = require('./strategy-store.js');
const Enviroment = require('../enviroment/index');

const readFile = util.promisify(fs.readFile);

class FileStrategy extends StrategyStore {

  constructor(path) {
    super();
    this._path = path;
  }

  static getFileName(username) {
    return username + '-configurations.json';
  }

  wasExistedConfigurationFile(filename) {
    const filePath = this.getFilePath(filename);
    return fs.existsSync(filePath);
  }

  getFilePath(filename) {
    return path.join(this._path, filename);
  }

  async getNumberOfAllConfigurations(username) {
    const filename = FileStrategy.getFileName(username);

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
    return JSON.parse(buffer.toString());
  }

  async select(condition, username) {
    const query = condition.getQuery();
    const fileName = FileStrategy.getFileName(username);
    const configurations = await this.getAllConfigurations(fileName);

    let results = [];
    for (let child of configurations.data) {
      let match = this.evaluateConfigurationWithQuery(child, query)
      if (match) {
        results.push(child);
      }
    }

    return results;
  }

  evaluateConfigurationWithQuery(configuration, query) {
    const queryRegex = /(?<id>\w+)\s*(?<op>(=|<|>|!)(=)?)\s*(?<value>[\w"]+)/g;
    query = query.replaceAll(queryRegex, 'configuration.$<id>$<op>$<value>');

    let isMatch = false;
    try {
      isMatch = eval(query);
    } catch (e) {
      isMatch = false;
    }

    return isMatch;
  }

  insert(configuration) {
    if (!this.wasExistedConfigurationFile(configuration)) {
      throw new Error('Method Not Implmentent!');
    }
  }

  update(assignments, condition) {
    throw new Error('Method Not Implmentent!');
  }

  delete(condition) {
    throw new Error('Method Not Implmentent!');
  }
}

module.exports = FileStrategy;
