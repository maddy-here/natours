const Tour = require("../model/tourModel");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // TASK:1 handle advance filtering
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = Tour.find(JSON.parse(queryStr));

    // TASK:2 handle sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    // TASK:3 handle limit queries i.e, get specific fields back from DB
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // TASK:4 handle pagination
    if (req.query.page) {
      const { page, limit } = req.query;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);

      const totalTours = await Tour.countDocuments();
      if (totalTours <= skip) {
        throw new Error("no more documents");
      }
    }

    // TASK:5 handle query aliasing
    // created own middleware for aliasing
    if (req.query.limit) {
      query = query.limit(req.query.limit);
    }

    const tours = await query;
    res.status(200).json({
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
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
      status: "successfully created tour",
      data: {
        newContent,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
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
      status: "success",
      data: {
        updatedContent,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
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
      status: "success",
      data: {
        tour: null,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
