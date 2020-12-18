const mongoose = require('mongoose');
const Assignment = require('../dto/assignment');
const Condition = require('../dto/condition');
const Configuration = require('../dto/configuration');
const ConfigurationModel = require('../../../database/mongo/schema/configuration');

class MongoStrategy {
  constructor(){
  }

  async insert(_configuration){
    // const configuration = new Configuration(_configuration);

    const model = new ConfigurationModel({
      _id: mongoose.Types.ObjectId(),
      user_id: 0
    });

    await model.save();

    return result;
  }
}

module.exports = MongoStrategy;
