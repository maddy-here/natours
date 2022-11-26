const Tour = require('../model/tourModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const tour = new ApiFeatures(Tour.find(), req.query);
  tour.filter().sort().limit().paginate();
  const tours = await tour.query;

  res.status(200).json({
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const data = req.body || undefined;
  if (!data) return;

  const newContent = await Tour.create(data);
  res.status(201).json({
    status: 'successfully created tour',
    data: {
      newContent,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError(`No tour found with id: ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body || undefined;

  if (!data) {
    return;
  }

  const tour = await Tour.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`No tour found with id: ${id}`), 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError(`No tour found with id: ${id}`, 404));
  }

  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
});
