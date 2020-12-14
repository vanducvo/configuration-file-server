const Assignment = require('../../../dto/assignment');
const Condition = require('../../../dto/condition');
const Configuration = require('../../../dto/configuration');

class MySQLQueryFactory {
  constructor(tableName, { configurationColName, userIdColName }) {
    this._tableName = tableName;
    this._configurationColName = configurationColName;
    this._userIdColName = userIdColName
  }

  static getInsertedId(response) {
    return response[0]['insertId'];
  }

  static getPropertyFromReponse(response, name) {
    let results = [];

    for (let row of response[0]) {
      results.push(row[name]);
    }

    return results;
  }

  static getPropertyFromSingleResponse(response, name) {
    return response[0][0][name];
  }

  selectConfiguration(condition) {

    const sql = this._conditionToSQL(condition);

    const query = `SELECT JSON_INSERT(${this._configurationColName}, '$._id', id) `
      + `as ${this._configurationColName} FROM ${this._tableName} WHERE `
      + sql.code;

    return {
      query,
      params: sql.params,
      getter: (response) => {
        return MySQLQueryFactory.getPropertyFromReponse(
          response,
          this._configurationColName
        );
      }
    };
  }

  insertConfiguration(_configuration) {
    const configuration = new Configuration(_configuration);

    const query = `INSERT INTO ${this._tableName}(${this._configurationColName},` +
      ` ${this._userIdColName}) VALUES (?, ?)`

    const params = [
      JSON.stringify(configuration.getConfig()),
      configuration.getUserId(),
    ];

    return {
      query,
      params,
      getter: (response) => {
        return MySQLQueryFactory.getInsertedId(response)
      }
    }
  }

  deleteConfiguration(condition) {

    const sql = this._conditionToSQL(condition);

    const query = `DELETE FROM ${this._tableName} WHERE ` + sql.code;

    return {
      query,
      params: sql.params,
    };
  }

  updateConfiguration(assignment, condition) {
    const sqlCondition = this._conditionToSQL(condition);
    const sqlAssignment = this._assignmentToSQL(assignment);

    const query = `UPDATE ${this._tableName} SET `
      + sqlAssignment.code
      + ' WHERE ' + sqlCondition.code;

    const params = [...sqlAssignment.params, ...sqlCondition.params];

    return {
      query,
      params
    };
  }

  countConfiguration(userId) {
    const query = `SELECT COUNT(*) as count FROM ${this._tableName} `
      + `WHERE ${this._userIdColName} = ?`;

    const params = [userId];

    return {
      query,
      params,
      getter: (response) => {
        return MySQLQueryFactory.getPropertyFromSingleResponse(response, 'count');
      }
    };
  }

  _conditionToSQL(_condition) {
    const condition = new Condition(_condition);

    let code = `${this._userIdColName} = ?`;
    let params = [condition._userId];

    for (const propertyname in condition._properties) {
      if (propertyname === '_id') {
        code += ` AND id = ?`;
      } else {
        code += ` AND ${this._configurationColName}->"$.${propertyname}" = ?`;
      }

      params.push(condition._properties[propertyname]);
    }

    return { code, params };
  }

  _assignmentToSQL(_assignment) {
    const assignment = new Assignment(_assignment);

    let code = `${this._configurationColName} = JSON_REPLACE(${this._configurationColName}`;
    let params = [];
    for (let propertyName in assignment._properties) {
      code += `, "$.${propertyName}", ?`;
      params.push(assignment._properties[propertyName]);
    }

    code += ')';
    return { code, params };
  }
}

module.exports = MySQLQueryFactory;