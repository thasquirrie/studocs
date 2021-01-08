const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  typeOfFile: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
