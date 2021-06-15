const express = require('express');
const BlogModel = require('../model/BlogModel');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const checkLogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.sendStatus(403);
    }
}

router.get('/', async function(req, res) {
    try {
        const Blog = await BlogModel.findAll();
        res.status(200).send(Blog);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    } finally {
        console.log('Request processed');
    }
});

router.get('/:id', async function(req, res) {
    const userID = req.params.id;
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
    body('title').notEmpty(),
    body('content').notEmpty(),
    body('userID').notEmpty(),
    async function(req, res) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }
        const { title, content, userID } = req.body;
        try {
            const newBlog = await BlogModel.create({
                title: title,
                content: content,
                user_id: userID 
            });
            res.status(200).send(newBlog);
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        } finally {
            console.log('Blog posted');
        }
    }
);

router.put('/:id', checkLogin, 
    body('title').notEmpty(),
    body('content').notEmpty(),
    async function(req, res) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }
        const id = req.params.id;
        const { title, content } = req.body;
        try {
            const updateBlog = await BlogModel.update({
                title: title,
                content: content
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
})

module.exports = router;