const fs = require('fs');
const v8 = require('v8');
const FileStrategy = require('./file-strategy.js');
const {
  Expression,
  Binary,
  Multary,
  Unary
} = require('./expression/index.js');

const settingNotHaveFile = {
  userId: 0,
  configuration: [

  ]
};

const settingHaveFile = {
  userId: 1,
  configuration: [
    {
      id: 0,
      capacity: 10,
      only: true,
      isDelete: false
    },
    {
      id: 1,
      capacity: 5,
      isDelete: true
    },
    {
      id: 2,
      capacity: 6,
      isDelete: false
    },
    {
      id: 3,
      capacity: 7,
      isDelete: false
    },
  ]
};


describe('File Strategy Test', () => {
  const root = process.cwd() + '/file-db';
  const storeToTestNotExists = root + '/0-configurations.json';
  const userIdNotYetStore = 3;
  const storeToTestInsert = root + `/${userIdNotYetStore}-configurations.json`;

  beforeAll(() => {
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
    }

    if (fs.existsSync(storeToTestInsert)) {
      fs.unlinkSync(storeToTestInsert);
    }

    if (fs.existsSync(storeToTestNotExists)) {
      fs.unlinkSync(storeToTestNotExists);
    }

    const content = {
      length: settingHaveFile.configuration.length,
      lastIndex: settingHaveFile.configuration.length,
      data: settingHaveFile.configuration
    };

    createFile(
      root,
      settingHaveFile.userId,
      content
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
    const setting = { ...settingNotHaveFile }

    const wasExisted = fileStrategy.wasExistedStore(
      FileStrategy.getFileName(setting.userId)
    );

    expect(wasExisted).toBeFalsy();
  });

  it('should check user have a configuration file', () => {
    const fileStrategy = new FileStrategy(root);
    const setting = { ...settingHaveFile };

    const wasExisted = fileStrategy.wasExistedStore(
      FileStrategy.getFileName(setting.userId)
    );

    expect(wasExisted).toBeTruthy();
  });

  describe('getNumberOfAllConfigurations', () => {
    const fileStrategy = new FileStrategy(root);
    it('should be 0 configurations when doest not exists file', async () => {
      const setting = { ...settingNotHaveFile }

      const n = await fileStrategy.getNumberOfAllConfigurations(
        setting.userId
      );

      expect(n).toEqual(0);
    });

    it('should be Number Of All Configurations', async () => {
      const setting = { ...settingHaveFile }

      const n = await fileStrategy.getNumberOfAllConfigurations(
        setting.userId
      );

      expect(n).toEqual(setting.configuration.length);
    });
  });

  describe('select', () => {
    const fileStrategy = new FileStrategy(root);
    const setting = { ...settingHaveFile }

    it(`shoud get with binary - operator: ${Expression.getOperators(Binary)}`, async () => {
      for (const operator of Expression.getOperators(Binary)) {
        const condition = {
          userId: setting.userId,
          [Binary[operator]]: ['id', 2]
        };

        const configurations = await fileStrategy.select(condition);

        expect(configurations.length).toBeGreaterThan(0);
      }
    });

    it(`shoud get with unary - operator: ${Expression.getOperators(Unary)}`, async () => {
      for (const operator of Expression.getOperators(Unary)) {
        const condition = {
          userId: setting.userId,
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
        userId: setting.userId,
        [Binary.EQUAL]: ['only', true]
      };

      const configurations = await fileStrategy.select(condition);

      expect(configurations.length).toBeGreaterThan(0);
    });

    it(`should get with multi - operator: ${Expression.getOperators(Multary)}`, async () => {
      for (const operator of Expression.getOperators(Multary)) {
        const condition = {
          userId: setting.userId,
          [Multary[operator]]: [
            {
              [Binary.GREATHAN_OR_EQUAL]: ['id', 2]
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
        gt: ['id', 2]
      };

      await expect(fileStrategy.select(condition)).rejects.toThrowError();
    });
  });

  describe('insert', () => {
    const fileStrategy = new FileStrategy(root);

    it('should throw error if not have userId', async () => {
      await expect(fileStrategy.insert({ age: 10 })).rejects.toThrowError();
    });

    it('should throw error if not have configuration exepect userId', async () => {
      await expect(fileStrategy.insert({ userId: 10 })).rejects.toThrowError();
    });

    it('should append into file configuration - if file does not exits', async () => {
      const setting = { userId: userIdNotYetStore };

      const timeNow = Date.now();
      const configuration = { userId: setting.userId, time: timeNow };

      await expectInsert(fileStrategy, configuration);
    });

    it('should append into file configuration - if file exsits', async () => {
      const setting = { ...settingHaveFile };

      const now = Date.now();
      const configuration = {
        userId: setting.userId,
        time: now,
        isDelete: false
      };

      expectInsert(fileStrategy, configuration);
    });
  });
});

async function expectInsert(fileStrategy, configuration) {
  const times = 5;
  for (let i = 0; i < times; i++) {
    await fileStrategy.insert(configuration);
  }

  const condition = {
    userId: configuration.userId,
    eq: ['time', configuration.time]
  };
  const expectConfigurations = await fileStrategy.select(condition);

  expect(expectConfigurations).toHaveLength(times);

  for (let i = 0; i < times - 1; i++) {
    expect(expectConfigurations[i].id).toEqual(expectConfigurations[i + 1].id - 1);
    expectConfiguration(expectConfigurations[i], configuration);
    expectConfiguration(expectConfigurations[i + 1], configuration);
  }
}

function expectConfiguration(expectConfiguration, { userId, ...configuration }) {
  expect(expectConfiguration).toMatchObject(configuration);
}

function createFile(path, name, data) {
  fs.writeFileSync(`${path}/${name}-configurations.json`, v8.serialize(data));
}
