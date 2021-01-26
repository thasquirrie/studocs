const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A request must have a title'],
        unique: true,
    },
    request: {
        type: String,
        required: [true, 'A request must have a body'],
    },
    category: {
        type: String,
        default: 'Computer Science',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual populate

// requestSchema.virtual('slug').get(function() {
//   return this.title.split(' ');
// })

requestSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'request',
    localField: '_id',
});

requestSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        // select: 'name',
    });
    next();
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;