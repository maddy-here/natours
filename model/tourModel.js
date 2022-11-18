const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected succesfully"));

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, "name must be unique"],
  },
  duration: {
    required: true,
    type: Number,
  },
  maxGroupSize: {
    required: [true, "max grooup size is required"],
    type: Number,
  },
  difficulty: {
    type: String,
    required: [true, "difficulty is required"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "price is required"],
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

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
