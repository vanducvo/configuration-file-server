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
    
    it('invalid json', () => {
      const condition = {
        and: [],
        or: []
      };

      expect(() => utils.parseFromJSON(condition)).toThrowError();
    });

    it('invalid sub json', () => {
      const condition = {
        and: true,
      };
      
      expect(() => utils.parseFromJSON(condition)).toThrowError();
    });
  });
});