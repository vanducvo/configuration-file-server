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

  selectConfiguration(properties, userId) {

    const sql = this._conditionToSQL(properties, userId);

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

  insertConfiguration(configuration, userId) {
    const query = `INSERT INTO ${this._tableName}(${this._configurationColName},` +
      ` ${this._userIdColName}) VALUES (?, ?)`

    const params = [
      JSON.stringify(configuration),
      userId,
    ];

    return {
      query,
      params,
      getter: (response) => {
        return MySQLQueryFactory.getInsertedId(response)
      }
    }
  }

  deleteConfiguration(properties, userId) {

    const sql = this._conditionToSQL(properties, userId);

    const query = `DELETE FROM ${this._tableName} WHERE ` + sql.code;

    return {
      query,
      params: sql.params,
    };
  }

  updateConfiguration(assignmentProperties, conditionProperties, userId) {
    const sqlCondition = this._conditionToSQL(conditionProperties, userId);
    const sqlAssignment = this._assignmentToSQL(assignmentProperties);

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

  _conditionToSQL(properties, userId) {

    let code = `${this._userIdColName} = ?`;
    let params = [userId];

    for (const propertyname in properties) {
      if (propertyname === '_id') {
        code += ` AND id = ?`;
      } else {
        code += ` AND ${this._configurationColName}->"$.${propertyname}" = ?`;
      }

      params.push(properties[propertyname]);
    }

    return { code, params };
  }

  _assignmentToSQL(properties) {
    let code = `${this._configurationColName} = JSON_REPLACE(${this._configurationColName}`;
    let params = [];
    for (let propertyName in properties) {
      code += `, "$.${propertyName}", ?`;
      params.push(properties[propertyName]);
    }

    code += ')';
    return { code, params };
  }
}

module.exports = MySQLQueryFactory;
