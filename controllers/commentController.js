const multer = require('multer');
const Comment = require('../model/Comment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('../controllers/handlerFactory');
const { diskStorage } = require('multer');
const Upload = require('../model/Upload');



const storage = diskStorage({
    destination: (req, file, cb) => {
        console.log('Yes this is called');
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];

        cb(null, `${file.originalname.split('.')[0]}-${Date.now()}.${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFiles = ['pdf', 'txt', 'epub'];
    if (file.mimetype.split('/')[1].includes(...allowedFiles) || file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                `The file type uploaded is '${
        file.mimetype.split('/')[1]
      }' and it's not allowed on this server`,
                400
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
});

exports.uploads = upload.single('file');


exports.getAllComments = handlerFactory.getAll(Comment);

exports.setRequestAndUserId = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    if (!req.body.request) req.body.request = req.params.requestId;

    next();
};

// exports.uploadFile = catchAsync(async(req, res, next) => {
//     if (!req.file) return next()
// })

exports.createComment = catchAsync(async(req, res, next) => {
    console.log('Both reqs:', req.file, req.body);
    if (!req.file && !req.body.comment) return next(new AppError('At least one of the input field is needed to post comment', 400));

    let upload, comment, commentBody, newUpload = {};

    if (req.file) {
        newUpload = {
            name: req.file.filename,
            user: req.user.id,
            file: req.file.mimetype.split('/')[1],
        };

        upload = await new Upload(newUpload).save();
    };

    if (req.body.comment) {
        if (req.file) {
            commentBody = {
                comment: req.body.comment,
                user: req.user.id,
                request: req.params.requestId,
                file: upload._id
            };
        } else {
            commentBody = {
                comment: req.body.comment,
                user: req.user.id,
                request: req.params.requestId
            };
        };

        comment = await new Comment(commentBody).save();
    }


    // if (req.file) upload = await Upload.create(newUpload)
    // if (req.file) commentBody.file = 

    console.log({ commentBody, newUpload, upload, comment });

    res.status(201).json({
        status: 'success',
        data: {
            comment,
            upload
        }
    });
});

exports.createReply = catchAsync(async(req, res, next) => {
    const reply = {
        body: req.body.body,
        replyUser: req.user.id,
    };

    const comment = await Comment.findById(req.params.id);

    if (!comment)
        return next(
            new AppError('No comment with that ID found on this server', 404)
        );

    comment.replies.push(reply);
    await comment.save();

    res.status(201).json({
        status: 'success',
        data: {
            comment,
        },
    });
});

exports.getComment = handlerFactory.getOne(Comment);
// exports.createComment = handlerFactory.createOne(Comment);
exports.updateComment = handlerFactory.updateOne(Comment);
exports.deleteComment = handlerFactory.deleteOne(Comment);