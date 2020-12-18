const MySQLQueryFactory = require('./configuration-query-factory.js');

describe('MYSQL Query Factory', () => {

  it('should be create instance with table name', () => {
    const mySQLSQueryFactory = new MySQLQueryFactory(
      'configuration',
      {
        jsonColName: 'data',
        userIdColName: 'user_id'
      }
    );

    expect(mySQLSQueryFactory).toBeInstanceOf(MySQLQueryFactory);
  });

  describe('conditionToSQL', () => {
    it('can change User Id to SQL condition code', () => {
      const mySQLQueryFactory = new MySQLQueryFactory(
        'configuration',
        {
          jsonColName: 'data',
          userIdColName: 'user_id'
        }
      );

      const properties = {

      }

      const userId = 0;

      const code = 'user_id = ?';
      const sql = mySQLQueryFactory._conditionToSQL(properties, userId);
      expect(sql.code).toEqual(code);
      expect(sql.params).toEqual([0]);
    });

    it('can change condition to SQL condition code', () => {
      const mySQLQueryFactory = new MySQLQueryFactory(
        'configuration',
        {
          configurationColName: 'data',
          userIdColName: 'user_id'
        }
      );

      const properties = {
        name: 'brew',
        age: 30
      }

      const userId = 0;

      const code = 'user_id = ? AND data->"$.name" = ? AND data->"$.age" = ?';
      const sql = mySQLQueryFactory._conditionToSQL(properties, userId);
      expect(sql.code).toEqual(code);
      expect(sql.params).toEqual([0, 'brew', 30]);
    });

    it('can change condition to SQL condition code special _id', () => {

      const mySQLQueryFactory = new MySQLQueryFactory(
        'configuration',
        {
          configurationColName: 'data',
          userIdColName: 'user_id'
        }
      );

      const properties = {
        _id: 10,
        name: 'brew',
        age: 30
      }

      const userId = 0;

      const code = 'user_id = ? AND id = ? AND data->"$.name" = ? AND data->"$.age" = ?';
      const sql = mySQLQueryFactory._conditionToSQL(properties, userId);
      expect(sql.code).toEqual(code);
      expect(sql.params).toEqual([0, 10, 'brew', 30]);
    });
  })


  it('can generate select configuration sql', () => {
    const mySQLSQueryFactory = new MySQLQueryFactory(
      'configuration',
      {
        configurationColName: 'data',
        userIdColName: 'user_id'
      }
    );

    const properties = {
      _id: 10,
      id: 20
    };

    const userId = 0;

    const expectQuery = "SELECT JSON_INSERT(data, '$._id', id) as data "
      + "FROM configuration WHERE user_id = ? AND id = ? AND data->\"$.id\" = ?";

    const expectParams = [0, 10, 20];

    const { query, params } = mySQLSQueryFactory.selectConfiguration(properties, userId);
    expect(query).toEqual(expectQuery);
    expect(params).toEqual(expectParams);
  });


  it('can generate insert configuration sql', () => {
    const mySQLSQueryFactory = new MySQLQueryFactory(
      'configuration',
      {
        configurationColName: 'data',
        userIdColName: 'user_id'
      }
    );

    const properties = {
      user: {
        firstname: 'Duc',
        lastname: 'Vo'
      }
    };

    const userId = 0;

    const expectQuery = `INSERT INTO configuration(data, user_id) VALUES (?, ?)`;

    const expectParams = [
      JSON.stringify(
        {
          user: {
            firstname: 'Duc',
            lastname: 'Vo'
          }
        }
      ),
      0
    ];

    const { query, params } = mySQLSQueryFactory.insertConfiguration(properties, userId);
    expect(query).toEqual(expectQuery);
    expect(params).toEqual(expectParams);
  });

  it('can generate delete configuration sql', () => {
    const mySQLSQueryFactory = new MySQLQueryFactory(
      'configuration',
      {
        configurationColName: 'data',
        userIdColName: 'user_id'
      }
    );

    const properties = {
      _id: 10,
      id: 20
    };

    const userId = 0;

    const expectQuery = "DELETE FROM configuration WHERE "
      + "user_id = ? AND id = ? AND data->\"$.id\" = ?";

    const expectParams = [0, 10, 20];

    const { query, params } = mySQLSQueryFactory.deleteConfiguration(properties, userId);
    expect(query).toEqual(expectQuery);
    expect(params).toEqual(expectParams);
  });

  it('can generate update configuration sql (update field)', () => {
    const mySQLSQueryFactory = new MySQLQueryFactory(
      'configuration',
      {
        configurationColName: 'data',
        userIdColName: 'user_id',
      }
    );

    const conditionProperties = {
      _id: 10,
    };

    const userId = 0;

    const assignmentProperties = {
      name: 'Brew',
    };

    const expectQuery = 'UPDATE configuration SET data = JSON_SET(data, "$.name", CAST (? AS JSON)) WHERE user_id = ? AND id = ?';


    const expectParams = ['"Brew"', userId, 10];

    const { queries, listOfParams } = mySQLSQueryFactory.updateConfiguration(assignmentProperties, conditionProperties, userId);
    expect(queries[0]).toEqual(expectQuery);
    expect(listOfParams[0]).toEqual(expectParams);
  });

  it('can generate update configuration sql (delete field)', () => {
    const mySQLSQueryFactory = new MySQLQueryFactory(
      'configuration',
      {
        configurationColName: 'data',
        userIdColName: 'user_id',
      }
    );

    const conditionProperties = {
      _id: 10,
    };

    const userId = 0;

    const assignmentProperties = {
      name: undefined,
    };

    const expectQuery = 'UPDATE configuration SET data = JSON_REMOVE(data, "$.name") WHERE user_id = ? AND id = ?';


    const expectParams = [0, 10];

    const { queries, listOfParams } = mySQLSQueryFactory.updateConfiguration(assignmentProperties, conditionProperties, userId);
    expect(queries[0]).toEqual(expectQuery);
    expect(listOfParams[0]).toEqual(expectParams);
  });

  it('can generate count number configugration of each user', () => {
    const mySQLSQueryFactory = new MySQLQueryFactory(
      'configuration',
      {
        configurationColName: 'data',
        userIdColName: 'user_id',
      }
    );

    const userId = 0;

    const expectQuery = 'SELECT COUNT(*) as count FROM configuration WHERE user_id = ?';
    const expectParams = [userId];
    const { query, params } = mySQLSQueryFactory.countConfiguration(userId);

    expect(query).toEqual(expectQuery);
    expect(params).toEqual(expectParams);
  });
});
