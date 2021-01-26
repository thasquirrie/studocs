const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'An upload must have a name'],
    },
    file: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    request: {
        type: mongoose.Schema.ObjectId,
        ref: 'Request'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

uploadSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo',
    });
    //   .populate({
    //     path: 'request',
    //     select: 'title',
    //   });
    next();
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;