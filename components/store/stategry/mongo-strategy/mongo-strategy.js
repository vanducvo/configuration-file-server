const mongoose = require('mongoose');
const Assignment = require('../dto/assignment');
const Condition = require('../dto/condition');
const Configuration = require('../dto/configuration');
const ConfigurationModel = require('../../../database/mongo/schema/configuration');

class MongoStrategy {
  constructor(uri) {
    this._pool = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  static configurationToDocument(configuration) {
    return {
      _id: mongoose.Types.ObjectId(),
      user_id: configuration.getUserId(),
      data: configuration.getProperties()
    };
  }

  static generateStageSelect(condition) {
    const expression = MongoStrategy.conditionToMongoExpression(condition);

    const actions = [
      {
        $match: expression,
      },
      {
        $addFields: {
          data: {
            _id: {
              $toString: "$_id"
            }
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: "$data"
        }
      },
    ];
    return actions;
  }

  static conditionToMongoExpression(condition) {
    const query = { user_id: condition.getUserId() };
    const properties = condition.getProperties();

    for (const key in properties) {
      query[`data.${key}`] = properties[key];
    }
    return query;
  }

  static getIdFromResponse(response) {
    return response._doc._id.toString();
  }

  async insert(_configuration) {
    const configuration = new Configuration(_configuration);

    const document = MongoStrategy.configurationToDocument(configuration);
    const model = new ConfigurationModel(document);

    await this._pool;
    const response = await model.save();

    return MongoStrategy.getIdFromResponse(response);
  }

  async select(_condition) {
    const condition = new Condition(_condition);

    const stages = MongoStrategy.generateStageSelect(condition);

    await this._pool;
    const configurations = ConfigurationModel.aggregate(stages);

    return configurations;
  }

  async delete(_condition) {
    const condition = new Condition(_condition);

    const expression = MongoStrategy.conditionToMongoExpression(condition);

    const result = this.select(_condition);
    await ConfigurationModel.deleteMany(expression);

    return result;
  }

  async update(_assignment, _condition) {
    const condition = new Condition(_condition);
    const assignment = new Assignment(_assignment);

    const expressionCondition = MongoStrategy.conditionToMongoExpression(condition);
    const { set, unset } = MongoStrategy.assignmentToMongoExpression(assignment);

    const a = await ConfigurationModel.update(expressionCondition, {
      $set: set,
      $unset: unset
    });

    const result = await this.select({ ..._condition, ..._assignment });

    return result;
  }

  static assignmentToMongoExpression(assignment) {
    const set = {};
    let unset = {};
    const properties = assignment.getProperties();

    for (const key in properties) {
      if (properties[key] === undefined) {
        unset[`data.${key}`] = 1 ;
      } else {
        set[`data.${key}`] = properties[key];
      }

    }
    return { set, unset };
  }
}

module.exports = MongoStrategy;
