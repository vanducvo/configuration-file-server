const fs = require('fs');

const FileStrategy = require('./file-strategy.js');
const Condition = require('../../dto/condition');

const settingNotHaveFile = {
  username: 'tester-no-exists',
  configuration: [

  ]
};

const settingHaveFile = {
  username: 'tester-exists',
  configuration: [
    {
      id: 0,
      capacity: 10
    },
    {
      id: 1,
      capacity: 5
    },
    {
      id: 2,
      capacity: 6
    },
    {
      id: 3,
      capacity: 7
    },
  ]
};

describe('File Strategy Test', () => {
  const path = process.cwd() + '/file-db';

  beforeAll(() => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    const content = {
      length: settingHaveFile.configuration.length,
      lastIndex: settingHaveFile.configuration.length,
      data: settingHaveFile.configuration
    };

    createFile(
      path,
      settingHaveFile.username,
      content
    );
  });

  it('should have constructor with path argument', () => {
    const fileStrategy = new FileStrategy(path);

    expect(fileStrategy).toBeInstanceOf(FileStrategy);
  });

  it('should get configuration filename', () => {
    const username = 'tester';
    const filename = 'tester-configurations.json';

    expect(FileStrategy.getFileName(username)).toEqual(filename)
  });

  it('should check user does not have a configuration file', () => {
    const fileStrategy = new FileStrategy(path);
    const setting = { ...settingNotHaveFile }

    const wasExisted = fileStrategy.wasExistedConfigurationFile(
      FileStrategy.getFileName(setting.username)
    );

    expect(wasExisted).toBeFalsy();
  });

  it('should check user have a configuration file', () => {
    const fileStrategy = new FileStrategy(path);
    const setting = { ...settingHaveFile };

    const wasExisted = fileStrategy.wasExistedConfigurationFile(
      FileStrategy.getFileName(setting.username)
    );

    expect(wasExisted).toBeTruthy();
  });

  describe('getNumberOfAllConfigurations', () => {
    const fileStrategy = new FileStrategy(path);
    it('should be 0 configurations when doest not exists file', async () => {
      const setting = { ...settingNotHaveFile }

      const n = await fileStrategy.getNumberOfAllConfigurations(
        setting.username
      );

      expect(n).toEqual(0);
    });

    it('should be Number Of All Configurations', async () => {
      const setting = { ...settingHaveFile }

      const n = await fileStrategy.getNumberOfAllConfigurations(
        setting.username
      );

      expect(n).toEqual(setting.configuration.length);
    });
  });

  describe('select', () => {
    const fileStrategy = new FileStrategy(path);
    const setting = { ...settingHaveFile }

    it('shoud get with single - operator: ==', async () => {
      await expectSelect(fileStrategy, setting, 'id == 2');
    });

    it('shoud get with single - operator: !=', async () => {
      await expectSelect(fileStrategy, setting, 'id != 2');
    });

    it('shoud get with single - operator: <', async () => {
      await expectSelect(fileStrategy, setting, 'id < 2');
    });

    it('shoud get with single - operator: >', async () => {
      await expectSelect(fileStrategy, setting, 'id > 0');
    });

    it('shoud get with single - operator: <=', async () => {
      await expectSelect(fileStrategy, setting, 'id <= 2');
    });

    it('shoud get with single - operator: >=', async () => {
      await expectSelect(fileStrategy, setting, 'id >= 2');
    });

    it('should get with multi - operator: and', async () => {
      await expectSelect(fileStrategy, setting, 'id >= 1 && capacity < 6');
    });

    it('should get with multi - operator: or', async () => {
      await expectSelect(fileStrategy, setting, 'id >= 1 || capacity < 6');
    });

    it('should get with multi - operator: complex with ( )', async () => {
      await expectSelect(fileStrategy, setting, '(id >= 1 && capacity < 6) || capacity >= 10');
    });

    it('should return [] with invalid query', async () => {
      await expectSelect(fileStrategy, setting, 'k.x > 10');
    });
  });

});

async function expectSelect(fileStrategy, setting, query) {
  const condition = new Condition(query);

  const configurations = await fileStrategy.select(condition, setting.username);


  const evaluateCondition = ({ id, capacity }) => {
    try {
      return eval(query);
    } catch (e) {
      return false;
    }
  };
  const n = setting.configuration.filter(evaluateCondition);

  expect(configurations).toEqual(n);
}

function createFile(path, name, data) {
  fs.writeFileSync(`${path}/${name}-configurations.json`, JSON.stringify(data));
}
