const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);
// const DB = process.env.DATABASE_LOCAL;
// console.log(DB);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connected to successfully');
    })
    .catch(err => {
        console.log(err);
    });

// console.log(process.env);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});