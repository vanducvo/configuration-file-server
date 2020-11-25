const fs = require('fs');

const FileStrategy = require('./file-strategy.js');

const configurationNotHaveFile = {
  username: 'tester-no-exists',
  configuration: [

  ]
};

const configurationHaveFile = {
  username: 'tester-exists',
  configuration: [
    {
      id: 0
    },
    {
      id: 1
    }
  ]
};

describe('File Strategy Test', () => {
  const path = process.cwd() + '/file-db';

  beforeAll(() => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    const content = {
      length: 2,
      data: configurationHaveFile.configuration
    };

    createFile(
      path,
      configurationHaveFile.username,
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
    const configuration = { ...configurationNotHaveFile }

    const wasExisted = fileStrategy.wasExistedConfigurationFile(
      FileStrategy.getFileName(configuration.username)
    );

    expect(wasExisted).toBeFalsy();
  });

  it('should check user have a configuration file', () => {
    const fileStrategy = new FileStrategy(path);
    const configuration = { ...configurationHaveFile };

    const wasExisted = fileStrategy.wasExistedConfigurationFile(
      FileStrategy.getFileName(configuration.username)
    );

    expect(wasExisted).toBeTruthy();
  });

  describe('getNumberOfAllConfigurations', () => {
    it('should be 0  configurations when doest not exists file', async () => {
      const fileStrategy = new FileStrategy(path);
      const configuration = { ...configurationNotHaveFile }

      const n = await fileStrategy.getNumberOfAllConfigurations(
        configuration.username
      );

      expect(n).toEqual(0);
    })
  });

  describe('getNumberOfAllConfigurations', () => {
    it('should be 0 configurations when doest not exists file', async () => {
      const fileStrategy = new FileStrategy(path);
      const configuration = { ...configurationNotHaveFile }

      const n = await fileStrategy.getNumberOfAllConfigurations(
        configuration.username
      );

      expect(n).toEqual(0);
    });

    it('should be Number Of All Configurations', async () => {
      const fileStrategy = new FileStrategy(path);
      const configuration = { ...configurationHaveFile }

      const n = await fileStrategy.getNumberOfAllConfigurations(
        configuration.username
      );

      expect(n).toEqual(configuration.configuration.length);
    });
  });

});

function createFile(path, name, data) {
  fs.writeFileSync(`${path}/${name}-configurations.json`, JSON.stringify(data));
}
