/**
 * Module dependency
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

/**
 * Collection schema
 */

const fields = {
  username: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['USER', 'MANAGER', 'ADMIN'],
    default: 'USER'
  },
  maxDayCalories: {
    type: Number
  }
};

const UserSchema = new Schema(fields);
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

