const Tour = require('../model/tourModel');
const ApiFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const tour = new ApiFeatures(Tour.find(), req.query);
    tour.filter().sort().limit().paginate();
    const tours = await tour.query;

    res.status(200).json({
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const data = req.body || undefined;
    if (!data) return;

    const newContent = await Tour.create(data);
    res.status(201).json({
      status: 'successfully created tour',
      data: {
        newContent,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body || undefined;
    if (!data) return;

    const updatedContent = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        updatedContent,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) throw new Error("Tour You're Trying to delete doesn't exist");

    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
