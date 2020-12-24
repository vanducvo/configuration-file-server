const MongoStrategy = require('./mongo-strategy');
const mongoose = require('mongoose');
const Condition = require('../dto/condition');

const UserId = {
  INSERT: 0,
  SELECT: 1,
  UDPATE: 2,
  DELETE: 3
}

describe('Mongo Strategy', () => {
  const uri = process.env.MONGODB_URI;

  beforeAll(async () => {

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await mongoose.connection.db.dropCollection('configurations');

    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await mongoose.disconnect();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Insert Method', () => {
    it('can insert configuration', async () => {
      const mongoStrategy = new MongoStrategy(uri);
      const configuration = {
        _userId: UserId.INSERT,
        name: 'Amazing'
      };

      const result = await mongoStrategy.insert(configuration);
      expect(result).toHaveLength(24);
    });
  });

  describe('Select Method', () => {
    it('can select configuration', async () => {
      const mongoStrategy = new MongoStrategy(uri);
      const configuration1 = {
        _userId: UserId.SELECT,
        firstname: 'magic',
        age: {
          lunar: 30,
          another: 31
        }
      };
      const configuration2 = {
        _userId: UserId.SELECT,
        firstname: 'magicx',
        age: {
          lunar: 30,
          another: 31
        }
      };

      await mongoStrategy.insert(configuration1);
      await mongoStrategy.insert(configuration2);

      const result = await mongoStrategy.select({
        _userId: UserId.SELECT, firstname: 'magic'
      });

      expect(result).toHaveLength(1);
      expect(result[0]._id).toHaveLength(24);
    });
  });

  describe('Delete Method', () => {
    it('can delete configuration', async () => {
      const mongoStrategy = new MongoStrategy(uri);
      const configuration = {
        _userId: UserId.DELETE,
        name: 'Amazing',
        a: 10
      };

      const condition = {
        _userId: UserId.DELETE,
        a: 10
      };

      await mongoStrategy.insert(configuration);

      const result = await mongoStrategy.delete(condition);
      const deleted = await mongoStrategy.select(condition);

      expect(result).toHaveLength(1);

      
      expect(deleted).toHaveLength(0);
    });
  });

  describe('Update Method', () => {
    it('can update configuration', async () => {
      const mongoStrategy = new MongoStrategy(uri);
      const configuration = {
        _userId: UserId.UDPATE,
        name: {
          firstname: 'ABC'
        },
        a: 10
      };

      const condition = {
        _userId: UserId.UDPATE,
        a: 10
      };

      const assignment = {
        name: {
          lastname: 'Amazing'
        }
      };

      await mongoStrategy.insert(configuration);

      const result = await mongoStrategy.update(assignment, condition);

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual({
        lastname: 'Amazing'
      });
    });


    it('can update delete field configuration', async () => {
      const mongoStrategy = new MongoStrategy(uri);
      const time = Date().toString();
      const configuration = {
        _userId: UserId.UDPATE,
        name: {
          firstname: 'ABC'
        },
        a: time
      };

      const condition = {
        _userId: UserId.UDPATE,
        a: time
      };

      const assignment = {
        name: undefined
      };

      await mongoStrategy.insert(configuration);

      const result = await mongoStrategy.update(assignment, condition);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBeUndefined();
    });
  });
});