const MongoStrategy = require('./mongo-strategy');
const mongoose = require('mongoose');

const UserId = {
  INSERT: 0,
  SELECT: 1,
  UDPATE: 2,
  DELETE: 3
}

describe('Mongo Strategy', () => {
  const uri = 'mongodb://127.0.0.1:27017/configuration_test';

  beforeAll(async () => {
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await mongoose.connection.db.dropCollection('configurations');

    await mongoose.disconnect();
  });

  beforeEach( async () => {
    await mongoose.disconnect();
  });

  afterAll( async () => {
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
});