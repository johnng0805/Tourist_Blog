const express = require('express');
const multer = require('multer');
const path = require('path');
const BlogModel = require('../model/BlogModel');
const { body, validationResult } = require('express-validator');
const User = require('../model/UserModel');

const router = express.Router();

const checkLogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.sendStatus(403);
    }
}

const storage = multer.diskStorage({
    destination: './public/images/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    //limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('blogImage');

function checkFileType(file, cb) {
    // Allowed ext
    const fileTypes = /jpeg|jpg|png/;
    // Check ext
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb('Error: Images only');
    }
}  

router.get('/', checkLogin, async function(req, res) {
    try {
        var Blog = await BlogModel.findAll();
        console.log(Blog);
        res.status(200).send(Blog);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    } finally {
        console.log('Request processed');
    }
});

router.get('/personalBlog', checkLogin, async function(req, res) {
    //const userID = req.params.id;
    const userID = req.session.User.userID.toString();
    try {
        const personalBlog = await BlogModel.findAll({
            where: {
                user_id: userID
            }
        });
        res.status(200).send(personalBlog);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/', checkLogin, 
    //body('title').notEmpty(),
    //body('content').notEmpty(),
    upload,
    async function(req, res) {
        const err = validationResult(req);
        /*if (!err.isEmpty()) {
            return res.sendStatus(400);
        }*/
        try {
            const { title, content } = req.body;
            var filename;
            if (req.file) {
                filename = req.file.filename;
            } else {
                filename = null;
            }
            const newBlog = await BlogModel.create({
                title: title,
                content: content,
                user_id: req.session.User.userID.toString(),
                image: filename
            });
            console.log(newBlog);
            if (newBlog) {
                res.status(200).send(newBlog);
            } else {
                res.sendStatus(400);
            }
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }   
    }
);

router.put('/:id', checkLogin, upload, 
    //body('title').notEmpty(),
    //body('content').notEmpty(),
    async function(req, res) {
        /*const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }*/
        try {
            const id = req.params.id;
            const { title, content } = req.body;
            var image;
            if (req.file) {
                image = req.file.filename;
            } else {
                image = null;
            }
            const updateBlog = await BlogModel.update({
                title: title,
                content: content,
                image: image
            }, {
                where: {
                    id: id
                }
            });
            res.status(200).send({ id, title, content });
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
);

router.delete('/:id', checkLogin, async function(req, res) {
    const id = req.params.id;
    try {
        await BlogModel.destroy({
            where: {
                id: id
            }
        });
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/view_blog', (req, res) => {
    try {
        const blogID = req.body.id;
        console.log(req.body);
        req.session.blogID = blogID;
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/blog_detail', checkLogin, async function(req, res) {
    try {
        const blogID = req.session.blogID;
        const blog = await BlogModel.findOne({
            where: {
                id: blogID
            }
        });
        (blog) ? res.status(200).send(blog) : res.sendStatus(404);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;