class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryStr = queryString;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // TASK:1 handle advance filtering
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }

    return this;
  }

  limit() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    if (this.queryStr.page) {
      const { page, limit } = this.queryStr;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = ApiFeatures;
