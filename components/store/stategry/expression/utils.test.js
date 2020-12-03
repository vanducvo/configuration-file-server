const Binary = require('./binary.js');
const Expression = require('./expression.js');
const Id = require('./id.js');
const Literal = require('./literal.js');
const Multary = require('./multary.js');
const Unary = require('./unary.js');
const utils = require('./utils.js');

describe('expression - utils', () => {
  describe('parseFromJSON', () => {
    it('parse and validate', () => {
      const expression = utils.parseFromJSON(
        {
          or: [
            {
              gt: ["user.age", 30]
            },
            {
              not: {
                ne: ["user.name", "sudoers"]
              }
            },
          ]
        }
      );

      const context = {
        user: {
          age: 31,
          name: "harry"
        }
      }

      expect(expression.evaluate(context)).toBeTruthy();
    });

    it('{} is always true', () => {
      expect(utils.parseFromJSON({}).evaluate({})).toBeTruthy();
    });

    it('invalid json', () => {
      const invalidJSONs = [
        {
          and: [],
          or: []
        },
        {
          and: true,
        },
        {
          not: {}
        },
        {
          omg: true
        }
      ];

      for (let json of invalidJSONs) {
        expect(() => utils.parseFromJSON(json)).toThrowError();
      }

    });

  });

  describe('parse id', () => {
    it('should parse string name to instance of Id', () => {
      const validNames = ['user.name', 'user', 'user1234.11w'];
      for (let name of validNames) {
        expect(utils.parseId(name)).toEqual(new Id(name));
      }
    });

    it('should detech invalid name', () => {
      const invalidNames = ['user.', '.user', '#'];
      for (let name of invalidNames) {
        expect(() => utils.parseId(name)).toThrowError('Invalid name');
      }
    });
  });

  describe('parse literal', () => {
    it('should parse number, string, bool, null to instance of Literal', () => {
      const validLiterals = [1, 1.1, true, false, null, 'str', NaN];
      for (let value of validLiterals) {
        expect(utils.parseLiteral(value)).toEqual(new Literal(value));

        expect(utils.parse(value)).toEqual(new Literal(value));
      }
    });

    it('should detect not literal value', () => {
      const invalidLiterals = [undefined, {}];
      for (let value of invalidLiterals) {
        expect(() => utils.parseLiteral(value)).toThrowError();

        expect(() => utils.parse(value)).toThrowError();
      }
    });
  });

  describe('parse unary', () => {
    it('should parse all unary operator', () => {
      const json = {
        not: {
          not: false
        }
      };

      const expression = utils.parseUnary(Unary.NOT, json.not);
      expect(expression.evaluate({})).toBeFalsy();

      const expressionGeneric = utils.parse(json);
      expect(expressionGeneric.evaluate({})).toBeFalsy();
    });
  });

  describe('parse binary', () => {
    it('should parse all binary operator', () => {
      const json = {
        operator: ["user.age", 30]
      };
      const context = { user: { age: 20 } };

      for (const operator of Expression.getOperators(Binary)) {
        const nameOfProperty = json.operator[0];
        const value = json.operator[1];
        const expression = utils.parseBinary(Binary[operator], nameOfProperty, value);
        expect(expression.evaluate(context)).not.toBeNull();

        const specidicOpetatorJSON = { [Binary[operator]]: json.operator };
        expect(utils.parse(specidicOpetatorJSON).evaluate(context)).not.toBeNull();
      }

    });
  });

  describe('parse multary', () => {
    it('should parse all multary operator', () => {
      const json = {
        operator: [
          {
            not: {
              ne: ['user.age', 20]
            }
          },
          {
            not: false
          }
        ]
      };
      const context = { user: { age: 20 } };

      for (const operator of Expression.getOperators(Multary)) {
        const expression = utils.parseMultary(Multary[operator], json.operator);
        expect(expression.evaluate(context)).toBeTruthy();

        const specificOperatorJSON = { [Multary[operator]]: json.operator };
        expect(utils.parse(specificOperatorJSON).evaluate(context)).toBeTruthy();
      }
    });
  });
});
