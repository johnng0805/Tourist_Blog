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
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 1000 * 60 }
}));

app.listen(process.env.PORT, function() {
    console.log('Starting blog server at port: ' + process.env.PORT);
})

const checkLogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.sendFile('./view/login.html', {root: __dirname});
    }
}

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/register', async function(req, res) {
    res.sendFile('./view/register.html', {root: __dirname});
});

app.get('/', checkLogin, async function(req, res) {
    res.sendFile('./view/index.html', {root: __dirname});
})

app.use('/user', UserController);

app.use('/blog', BlogController);