const mongoose = require('mongoose');
const caloriesApi = require('../controller/caloriesApiCntlr')
const Schema = mongoose.Schema;

/**
 * Meal Schema.
 */

const fields = {
  meal: {
    type: String,
    required: true
  },

  time: {
    type: Date,
    required: true,
    index: true
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  calories: {
    type: Number
  },

  nutrition: {
    type: Schema.Types.Mixed
  }
};

const MealSchema = new Schema(fields);

MealSchema.pre('save', function (next) {
  if (!this.calories) {
    caloriesApi(this, (err, body) => {
      if (!err) {
        this.calories = body.foods[0].nf_calories;
        this.nutrition = body;
      }
      next()
    })
  } else {
    next()
  }
})

MealSchema.pre('validate', function (next) {
  if (this.startDate > this.endDate) {
    next(Error('End Date must be greater than Start Date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Meal', MealSchema);

