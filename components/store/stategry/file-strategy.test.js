const fs = require('fs');
const v8 = require('v8');
const FileStrategy = require('./file-strategy.js');
const {
  Expression,
  Binary,
  Multary,
  Unary
} = require('./expression/index.js');

const UserID = {
  EMPTY: 0,
  COMMON:1,
  INSERT_NOT_EXISTED: 2,
  INSERT_EXISTED: 3,
  DELETE: 4,
  UPDATE: 5
};

const STORE = {
  length: 4,
  lastIndex: 4,
  data: [
    {
      _id: 0,
      capacity: 10,
      only: true,
      isDelete: false
    },
    {
      _id: 1,
      capacity: 5,
      isDelete: true
    },
    {
      _id: 2,
      capacity: 6,
      isDelete: false
    },
    {
      _id: 3,
      capacity: 7,
      isDelete: false
    },
  ]
};

const root = process.cwd() + '/file-db';

describe('File Strategy Test', () => {
  beforeAll(() => {
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
    }

    createFile(
      root,
      UserID.COMMON,
      STORE
    );
  });

  it('should have constructor with path argument', () => {
    const fileStrategy = new FileStrategy(root);

    expect(fileStrategy).toBeInstanceOf(FileStrategy);
  });

  it('should get configuration filename', () => {
    const userId = 1;
    const filename = '1-configurations.json';

    expect(FileStrategy.getFileName(userId)).toEqual(filename)
  });

  it('should check user does not have a configuration file', () => {
    const fileStrategy = new FileStrategy(root);

    const wasExisted = fileStrategy.wasExistedStore(
      FileStrategy.getFileName(UserID.EMPTY)
    );

    expect(wasExisted).toBeFalsy();
  });

  it('should check user have a configuration file', () => {
    const fileStrategy = new FileStrategy(root);

    const wasExisted = fileStrategy.wasExistedStore(
      FileStrategy.getFileName(UserID.COMMON)
    );

    expect(wasExisted).toBeTruthy();
  });

  describe('getNumberOfAllConfigurations', () => {
    const fileStrategy = new FileStrategy(root);
    it('should be 0 configurations when doest not exists file', async () => {
      const n = await fileStrategy.getNumberOfAllConfigurations(
        UserID.EMPTY
      );

      expect(n).toEqual(0);
    });

    it('should be Number Of All Configurations', async () => {
      const n = await fileStrategy.getNumberOfAllConfigurations(
        UserID.COMMON
      );

      expect(n).toEqual(STORE.length);
    });
  });

  describe('select', () => {
    const fileStrategy = new FileStrategy(root);

    it(`shoud get with binary - operator: ${Expression.getOperators(Binary)}`, async () => {
      for (const operator of Expression.getOperators(Binary)) {
        const condition = {
          _userId: UserID.COMMON,
          [Binary[operator]]: ['_id', 2]
        };

        const configurations = await fileStrategy.select(condition);

        expect(configurations.length).toBeGreaterThan(0);
      }
    });

    it(`shoud get with unary - operator: ${Expression.getOperators(Unary)}`, async () => {
      for (const operator of Expression.getOperators(Unary)) {
        const condition = {
          _userId: UserID.COMMON,
          [Unary[operator]]: {
            [Binary.NOT_EQUAL]: ['isDelete', true]
          }
        };

        const configurations = await fileStrategy.select(condition);

        expect(configurations.length).toBeGreaterThan(0);
      }
    });

    it(`shoud get with condition have some configuration wrong path`, async () => {
      const condition = {
        _userId: UserID.COMMON,
        [Binary.EQUAL]: ['only', true]
      };

      const configurations = await fileStrategy.select(condition);

      expect(configurations.length).toBeGreaterThan(0);
    });

    it(`should get with multi - operator: ${Expression.getOperators(Multary)}`, async () => {
      for (const operator of Expression.getOperators(Multary)) {
        const condition = {
          _userId: UserID.COMMON,
          [Multary[operator]]: [
            {
              [Binary.GREATHAN_OR_EQUAL]: ['_id', 2]
            },
            {
              [Binary.LESSTHAN]: ['capacity', 7]
            }
          ]
        };

        const configurations = await fileStrategy.select(condition);

        expect(configurations.length).toBeGreaterThan(0);
      }
    });

    it('should throw with invalid condition', async () => {
      const condition = {
        gt: ['_id', 2]
      };

      await expect(fileStrategy.select(condition)).rejects.toThrowError();
    });
  });

  describe('insert', () => {
    const fileStrategy = new FileStrategy(root);

    beforeEach(() => {
      const storeNotExists = `${root}/${UserID.INSERT_NOT_EXISTED}-configurations.json`;
      if (fs.existsSync(storeNotExists)) {
        fs.unlinkSync(storeNotExists);
      }

      createFile(
        root,
        UserID.INSERT_EXISTED,
        STORE
      );
    });
    it('should throw error if not have userId', async () => {
      await expect(fileStrategy.insert({ age: 10 })).rejects.toThrowError();
    });

    it('should throw error if not have configuration exepect userId', async () => {
      await expect(fileStrategy.insert({ _userId: 10 })).rejects.toThrowError();
    });

    it('should append into file configuration - if file does not exits', async () => {
      const timeNow = Date.now();
      const configuration = { _userId: UserID.INSERT_NOT_EXISTED, time: timeNow };

      await expectInsert(fileStrategy, configuration);
    });

    it('should append into file configuration - if file exsits', async () => {
      const now = Date.now();
      const configuration = {
        _userId: UserID.INSERT_EXISTED,
        time: now,
        isDelete: false
      };

      expectInsert(fileStrategy, configuration);
    });
  });

  describe('delete', () => { 
    const fileStrategy = new FileStrategy(root);

    beforeEach(() => {
      const storeNotExists = UserID.INSERT_NOT_EXISTED + '-configurations.json';
      if (fs.existsSync(storeNotExists)) {
        fs.unlinkSync(storeNotExists);
      }

      createFile(
        root,
        UserID.DELETE,
        STORE
      );
    });

    it('should throw error if condition not have userId', async () => {
      const condition = {
        eq: ['_id', 0]
      };

      const message = 'Must have userId constraint!';

      await expect(fileStrategy.delete(condition)).rejects.toThrowError(message);
    });

    it('should throw error if user does not have store file', async () => {
      const condition = {
        _userId: UserID.EMPTY,
        eq: ['_id', 0]
      };

      await expect(fileStrategy.delete(condition)).rejects.toThrowError();
    });

    it('should delele configuration if it match any configuration', async () => {
      const condition = {
        _userId: UserID.DELETE,
        eq: ['_id', 0]
      };

      const n = await fileStrategy.delete(condition);
      
      expect(n).toEqual(1);
    });

    it('should delele configuration if it does not match any configuration', async () => {
      const condition = {
        _userId: UserID.DELETE,
        eq: ['_id', 10]
      };

      const n = await fileStrategy.delete(condition);
      
      expect(n).toEqual(0);
    });
  });

  describe('update', () => {
    const fileStrategy = new FileStrategy(root);
    
    beforeEach(() => {
      createFile(
        root,
        UserID.UPDATE,
        STORE
      );
    });

    it('should throw error if condition not have userId', async () => {
      const condition = { eq: ['id', 0] };
      const assignments = [];
      const message = 'Must have userId constraint!';
      await expect(fileStrategy.update(assignments, condition)).rejects.toThrowError(message);
    });
  });

});

async function expectInsert(fileStrategy, configuration) {
  const times = 5;
  for (let i = 0; i < times; i++) {
    await fileStrategy.insert(configuration);
  }

  const condition = {
    _userId: configuration._userId,
    eq: ['time', configuration.time]
  };
  const expectConfigurations = await fileStrategy.select(condition);

  expect(expectConfigurations).toHaveLength(times);

  for (let i = 0; i < times - 1; i++) {
    expect(expectConfigurations[i]._id).toEqual(expectConfigurations[i + 1]._id - 1);
    expectConfiguration(expectConfigurations[i], configuration);
    expectConfiguration(expectConfigurations[i + 1], configuration);
  }
}

function expectConfiguration(expectConfiguration, { _userId, ...configuration }) {
  expect(expectConfiguration).toMatchObject(configuration);
}

function createFile(path, name, data) {
  fs.writeFileSync(`${path}/${name}-configurations.json`, v8.serialize(data));
}
