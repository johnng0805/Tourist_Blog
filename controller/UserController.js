const express = require('express');
const validator = require('express-validator');
const bcrypt = require('bcryptjs');
const UserModel = require('../model/UserModel');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const saltRounds = 10;

const checkLogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.sendStatus(403);
    }
}

router.post('/register', 
    body('email').isEmail().normalizeEmail(),
    body('name').notEmpty().isAlphanumeric(),
    body('gender').notEmpty().isAlphanumeric(),
    body('password').notEmpty().isAlphanumeric(),
    async function(req, res) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }
        const { email, name, gender, password } = req.body;
        console.log(req.body);
        try {
            const hashedPass = bcrypt.hashSync(password, saltRounds);
            const [ user, created ] = await UserModel.findOrCreate({
                where: {
                    email: email
                },
                defaults: {
                    email: email,
                    name: name,
                    gender: gender,
                    password: hashedPass
                }
            });
            if (!created) {
                res.status(200).send({status: false});
            } else {
                res.status(200).send(user);
            }
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
);

router.put('/:id', checkLogin, 
    body('email').isEmail().normalizeEmail(),
    body('name').notEmpty().isAlphanumeric(),
    body('password').notEmpty().isAlphanumeric(),
    async function(req, res) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }
        const id = req.params.id;
        const { email, name, password } = req.body;
        const hashedPass = bcrypt.hashSync(password, saltRounds);
        try {
            const updateUser = await UserModel.update({
                email: email,
                name: name,
                password: hashedPass
            }, {
                where: {
                    id: id
                }
            });
            res.status(200).send({ email, name });
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
);

router.get('/:id', checkLogin, async function(req, res) {
    const id = req.params.id;
    try {
        const userInfo = await UserModel.findOne({
            where: {
                id: id
            }
        });
        res.status(200).send(userInfo);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/login', 
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isAlphanumeric(),
    async function(req, res) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }
        const { email, password } = req.body;
        try {
            const userInfo = await UserModel.findOne({
                where: {
                    email: email
                }
            });
            if (userInfo) {
                if (bcrypt.compareSync(password, userInfo.password)) {
                    req.session.loggedIn = true;
                    req.session.User = {
                        userID: userInfo.id,
                        userEmail: userInfo.email,
                        userName: userInfo.name
                    };
                    res.sendStatus(200);
                } else {
                    res.status(200).send({status: false});
                }
            } else {
                res.status(200).send({status: false});
            }
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
)


module.exports = router;