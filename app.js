const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const UserController = require('./controller/UserController');
const BlogController = require('./controller/BlogController');
const path = require('path');

dotenv.config();
const app = express();

app.use(express.json());

app.use(session({
    secret: 'cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 1000 * 60 }
}));

app.listen(process.env.PORT, function() {
    console.log('Starting blog server at port: ' + process.env.PORT);
})

app.use('/user', UserController);

app.use('/blog', BlogController);