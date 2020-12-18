const mongoose = require('mongoose');
const { Schema } = mongoose;

const configurationSchema = new Schema({
  _id: Schema.Types.ObjectId,
  user_id: Number
});

const Configuration = mongoose.model('Configuration', configurationSchema);

module.exports = Configuration;
