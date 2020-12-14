const fs = require('fs');
const v8 = require('v8');
const FileStrategy = require('./file-strategy.js');

const UserID = {
  EMPTY: 0,
  COMMON: 1,
  INSERT_NOT_EXISTED: 2,
  INSERT_EXISTED: 3,
  DELETE: 4,
  UPDATE: 5,
  INSERT_LIMITED: 6
};


const root = process.cwd() + '/file-db';

describe('File Strategy Test', () => {

  beforeAll(() => {
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root);
    }
  });

  it('can have constructor with path argument', () => {
    const fileStrategy = new FileStrategy(root);

    expect(fileStrategy).toBeInstanceOf(FileStrategy);
  });

  it('can get configuration filename', () => {
    const userId = 1;
    const filename = '1-configurations.json';

    expect(FileStrategy.getFileName(userId)).toEqual(filename)
  });

  it('can check user does not have a configuration file', () => {
    const fileStrategy = new FileStrategy(root);

    const wasExisted = fileStrategy.wasExistedStore(
      FileStrategy.getFileName(UserID.EMPTY)
    );

    expect(wasExisted).toBeFalsy();
  });

  it('can check user have a configuration file', () => {
    const fileStrategy = new FileStrategy(root);
    const store = {
      length: 0,
      lastIndex: 0,
      data:
        [
          
        ]
    };

    createFile(root, UserID.COMMON, store);
    const wasExisted = fileStrategy.wasExistedStore(
      UserID.COMMON
    );

    expect(wasExisted).toBeTruthy();
  });

  describe('can get useConfigurationCount', () => {

    it('should be 0 configurations when doest not exists file', async () => {
      const fileStrategy = new FileStrategy(root);
      const n = await fileStrategy.userConfigurationCount(
        UserID.EMPTY
      );

      expect(n).toEqual(0);
    });

    it('should be number of configurations', async () => {
      const fileStrategy = new FileStrategy(root);
      const store = {
        length: 2,
        lastIndex: 2,
        data:
          [
            {
              _id: 0,
              name: 'sudo'
            },
            {
              _id: 1,
              name: 'brew'
            }
          ]
      };

      createFile(root, UserID.COMMON, store);

      const n = await fileStrategy.userConfigurationCount(
        UserID.COMMON
      );

      expect(n).toEqual(store.length);
    });
  });

  describe('can select', () => {
    it('have some configuration match', async () => {
      const fileStrategy = new FileStrategy(root);
      const store = {
        length: 2,
        lastIndex: 2,
        data:
          [
            {
              _id: 0,
              name: 'sudo'
            },
            {
              _id: 1,
              name: 'brew'
            }
          ]
      };

      createFile(root, UserID.INSERT_EXISTED, store);

      const n = await fileStrategy.select(
        {
          _userId: UserID.INSERT_EXISTED,
          name: 'brew'
        }
      );

      expect(n).toHaveLength(1);
      expect(n[0]).toEqual(store.data[1]);
    });

    it('do not have any configuration match', async () => {
      const fileStrategy = new FileStrategy(root);
      const store = {
        length: 2,
        lastIndex: 2,
        data:
          [
            {
              _id: 0,
              name: 'sudo'
            },
            {
              _id: 1,
              name: 'brew'
            }
          ]
      };

      createFile(root, UserID.INSERT_EXISTED, store);

      const n = await fileStrategy.select(
        {
          _userId: UserID.INSERT_EXISTED,
          age: 30
        }
      );

      expect(n).toHaveLength(0);
    });
  });

  describe('can insert', () => {

    it('can append into file configuration - if file does not exits', async () => {
      const fileStrategy = new FileStrategy(root);

      deleteStore(root, UserID.INSERT_NOT_EXISTED);
      const timeNow = Date.now();
      const properties = { _userId: UserID.INSERT_NOT_EXISTED, time: timeNow };

      await expectInsert(fileStrategy, properties);
    });

    it('can append into file configuration - if file exsits', async () => {
      const fileStrategy = new FileStrategy(root);
      const now = Date.now();
      const properties = {
        _userId: UserID.INSERT_EXISTED,
        time: now,
        isDelete: false
      };

      const store = {
        length: 1,
        lastIndex: 1,
        data: [
          {
            _id: 0
          }
        ]
      }
      createFile(root, UserID.INSERT_EXISTED, store);

      await expectInsert(fileStrategy, properties);
    });

    it('can return id of configuration appended', async () => {
      const fileStrategy = new FileStrategy(root);
      const now = Date.now();
      const properties = {
        _userId: UserID.INSERT_EXISTED,
        time: now,
        isDelete: false
      };

      const store = {
        length: 1,
        lastIndex: 1,
        data: [
          {
            _id: 0
          }
        ]
      }
      createFile(root, UserID.INSERT_EXISTED, store);

      const id = await fileStrategy.insert(properties);

      expect(id).toEqual(1);
    });


    it('can return id of configuration appended', async () => {
      const limit = 1;
      const fileStrategy = new FileStrategy(root, limit);
      const now = Date.now();
      const properties = {
        _userId: UserID.INSERT_LIMITED,
        time: now,
        isDelete: false
      };

      const store = {
        length: 1,
        lastIndex: 1,
        data: [
          {
            _id: 0
          }
        ]
      }
      createFile(root, UserID.INSERT_LIMITED, store);

      const message = 'Exceed Limit Configuarion Each File';
      await expect(fileStrategy.insert(properties)).rejects.toThrowError(message);
    });
  });

  describe('delete', () => {
    it('can delele configuration if it match some configuration', async () => {
      const fileStrategy = new FileStrategy(root);
      
      const store = {
        length: 1,
        lastIndex: 1,
        data: [
          {
            _id: 0
          },
          {
            _id: 1
          },
        ]
      }
      createFile(root, UserID.DELETE, store);

      const condition = {
        _userId: UserID.DELETE,
        _id: 0
      };

      const deletedConfigurations = await fileStrategy.delete(condition);
      expect(deletedConfigurations).toHaveLength(1);
      expect(deletedConfigurations[0]).toEqual(store.data[0]);
    });

    it('should return [] when user not yet have configuration file', async () => {
      const fileStrategy = new FileStrategy(root);

      const condition = {
        _userId: UserID.EMPTY,
        _id: 0
      };

      const deletedConfigurations = await fileStrategy.delete(condition);
      expect(deletedConfigurations).toHaveLength(0);

    });

    it('can delele configuration if it does not match any configuration', async () => {
      const fileStrategy = new FileStrategy(root);
      
      const store = {
        length: 1,
        lastIndex: 1,
        data: [
          {
            _id: 0
          },
          {
            _id: 1
          },
        ]
      }
      createFile(root, UserID.DELETE, store);

      const condition = {
        _userId: UserID.DELETE,
        name: 'sudo'
      };

      const deletedConfigurations = await fileStrategy.delete(condition);
      expect(deletedConfigurations).toHaveLength(0);
    });
  });

  describe('update', () => {

    it('can update property', async () => {
      const fileStrategy = new FileStrategy(root);
      const store = {
        length: 1,
        lastIndex: 1,
        data: [
          {
            _id: 0,
            name: 'sudo'
          },
          {
            _id: 1,
            name: 'nani'
          },
        ]
      };
      createFile(root, UserID.UPDATE, store);

      const condition = {
        _userId: UserID.UPDATE,
        _id: 0
      };

      const assignment = {
        name: 'brew'
      };

      const updatedConfigurations = await fileStrategy.update(assignment, condition);
      const configuration = await fileStrategy.select(condition);

      expect(updatedConfigurations).toHaveLength(1);
      expect(configuration[0].name).toEqual(assignment.name);
    });

    it('should delete property', async () => {
      const fileStrategy = new FileStrategy(root);
      const store = {
        length: 1,
        lastIndex: 1,
        data: [
          {
            _id: 0,
            name: 'sudo'
          },
          {
            _id: 1,
            name: 'nani'
          },
        ]
      };
      createFile(root, UserID.UPDATE, store);

      const condition = {
        _userId: UserID.UPDATE,
        _id: 0
      };

      const assignment = {
        name: undefined
      };

      const updatedConfigurations = await fileStrategy.update(assignment, condition);
      const configuration = await fileStrategy.select(condition);

      expect(updatedConfigurations).toHaveLength(1);
      expect(configuration[0].name).toBeUndefined();
    });
  });

});

function deleteStore(root, userId) {
  const storeNotExists = `${root}/${userId}-configurations.json`;
  if (fs.existsSync(storeNotExists)) {
    fs.unlinkSync(storeNotExists);
  }
}

async function expectInsert(fileStrategy, configuration) {
  const times = 5;
  for (let i = 0; i < times; i++) {
    await fileStrategy.insert(configuration);
  }

  const condition = {
    _userId: configuration._userId,
    time: configuration.time
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

function createFile(path, userId, store) {
  fs.writeFileSync(`${path}/${userId}-configurations.json`, v8.serialize(store));
}
