class ConfigurationQueryFactory {
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
        return ConfigurationQueryFactory.getPropertyFromReponse(
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
        return ConfigurationQueryFactory.getInsertedId(response)
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
    const sqlAssignmentUpdate = this._assignmentToSQLUpdate(assignmentProperties);
    const sqlAssignmentRemove = this._assignmentToSQLRemove(assignmentProperties);

    let queries = [];
    let listOfParams = [];

    if(sqlAssignmentUpdate.params.length > 0){
      const queryUpdate = `UPDATE ${this._tableName} SET `
        + sqlAssignmentUpdate.code
        + ' WHERE ' + sqlCondition.code;
      const paramsUpdate = [...sqlAssignmentUpdate.params, ...sqlCondition.params];
      
      queries.push(queryUpdate);
      listOfParams.push(paramsUpdate);
    }

    if(sqlAssignmentRemove.hasRemove){
      const queryRemove = `UPDATE ${this._tableName} SET `
      + sqlAssignmentRemove.code
      + ' WHERE ' + sqlCondition.code;
      const paramsRemove = [...sqlCondition.params];
      
      queries.push(queryRemove);
      listOfParams.push(paramsRemove);
    }

    return {
      queries,
      listOfParams
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
        return ConfigurationQueryFactory.getPropertyFromSingleResponse(response, 'count');
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

  _assignmentToSQLUpdate(properties) {
    let code = `${this._configurationColName} = JSON_SET(${this._configurationColName}`;
    let params = [];

    for (const name in properties) {
      if (properties[name] !== undefined) {
        code += `, "$.${name}", CAST (? AS JSON)`;
        params.push(JSON.stringify(properties[name]));
      }
    }

    code += ')';
    return { code, params };
  }

  _assignmentToSQLRemove(properties) {
    let code = `${this._configurationColName} = JSON_REMOVE(${this._configurationColName}`;

    let hasRemove = false;
    for (const name in properties) {
      if (properties[name] === undefined) {
        hasRemove = true;
        code += `, "$.${name}"`;
      }
    }
    code += ')';

    return { code, hasRemove };
  }
}

module.exports = ConfigurationQueryFactory;
