const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Request = require('../../model/Request');
const User = require('../../model/User');
const Comment = require('../../model/Comment');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE_LOCAL;
// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database connected successfully...');
  });

const requests = JSON.parse(
  fs.readFileSync(`${__dirname}/requests.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const comments = JSON.parse(
  fs.readFileSync(`${__dirname}/comments.json`, 'utf-8')
);
// console.log(requests.length);

console.log(process.argv[2]);

const importData = async () => {
  try {
    await Request.insertMany(requests);
    await User.insertMany(users);
    await Comment.insertMany(comments);

    console.log('Data imported successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Request.deleteMany();
    await User.deleteMany();
    await Comment.deleteMany();
    console.log('Data deleted successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
