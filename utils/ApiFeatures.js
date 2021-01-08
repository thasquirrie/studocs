class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
  
      excludedFields.forEach(el => delete queryObj[el]);
      // console.log(queryObj);
  
      // Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      // Sorting
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-dateCreated');
      }
  
      return this;
    }
  
    fields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    page() {
      const limit = Number(this.queryString.limit) || 10;
      if (this.queryString.page) {
        const page = Number(this.queryString.page);
        const skip = (page - 1) * limit;
        console.log(skip);
        this.query = this.query.skip(skip).limit(limit);
      } else {
        this.query = this.query.skip(0).limit(limit);
      }
  
      return this;
    }
  }

  
module.exports = APIFeatures;