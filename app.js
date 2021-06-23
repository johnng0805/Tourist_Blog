const express = require('express');
const session = require('express-session');
const multer = require('multer');
const dotenv = require('dotenv');
const UserController = require('./controller/UserController');
const BlogController = require('./controller/BlogController');
const path = require('path');
var bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(express.json());
app.use(bodyParser.json());

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
};

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/register', async function(req, res) {
    res.sendFile('./view/register.html', {root: __dirname});
});

app.get('/', async function(req, res) {
    res.sendFile('./view/index.html', {root: __dirname});
});

app.get('/createBlog', checkLogin, async function(req, res) {
    res.sendFile("./view/create_Post.html", {root: __dirname});
});

app.get('/about_me', checkLogin, async function(req, res) {
    res.sendFile('./view/about_me.html', {root: __dirname});
});

app.get('/my_photos', checkLogin, async function(req, res) {
    res.sendFile('./view/timeline-photos.html', {root: __dirname});
});

app.get('/personal_blog', checkLogin, async function(req, res) {
    res.sendFile('./view/personal_blog.html', {root: __dirname});
});

app.get('/blog_detail', async function(req, res) {
    res.sendFile('./view/blog_detail.html', {root: __dirname});
});

app.use('/user', UserController);

app.use('/blog', BlogController);