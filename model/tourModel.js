const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, 'name must be unique'],
    maxlength: [40, 'name must be less than or equal to 40 chars'],
    minlength: [10, 'name must be greater than or equal to 10 chars'],
  },
  duration: {
    required: true,
    type: Number,
  },
  maxGroupSize: {
    required: [true, 'max grooup size is required'],
    type: Number,
  },
  difficulty: {
    type: String,
    required: [true, 'difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Only easy, medium and hard difficulties are acceptable',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    max: [5, 'maximum 5.0 ratings are allowed'],
    min: [0, 'minimum 0 ratings are allowed'],
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageCover: {
    type: String,
    required: true,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
