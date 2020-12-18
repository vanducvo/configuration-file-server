const MongoStrategy = require('./mongo-strategy');
const { Enviroment, StoreTypes } = require('../../../enviroment');
const mongoose = require('mongoose');

describe('Mongo Strategy', () => {

  beforeAll(async () => {
    uri = 'mongodb://127.0.0.1:27017/configuration_test';

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  describe('Insert Method', () => {
    it('can insert configuration', async () => {
      const mongoStrategy = new MongoStrategy();
      await mongoStrategy.insert();
    });
  });
});