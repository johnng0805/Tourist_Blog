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
    body('last_name').notEmpty().isAlphanumeric(),
    body('first_name').notEmpty().isAlphanumeric(),
    body('gender').notEmpty().isAlphanumeric(),
    body('birthday').notEmpty(),
    body('phone').notEmpty().isAlphanumeric(),
    body('password').notEmpty().isAlphanumeric(),
    async function(req, res) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }
        const { email, last_name, first_name, gender, birthday, phone, password } = req.body;
        console.log(req.body);
        try {
            const hashedPass = bcrypt.hashSync(password, saltRounds);
            const [ user, created ] = await UserModel.findOrCreate({
                where: {
                    email: email
                },
                defaults: {
                    email: email,
                    last_name: last_name,
                    first_name: first_name,
                    birthday: birthday,
                    phone: phone,
                    gender: gender,
                    password: hashedPass
                }
            });
            if (!created) {
                res.sendStatus(409);
            } else {
                res.sendStatus(200);
            }
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
);

router.put('/:id', checkLogin, 
    body('email').isEmail().normalizeEmail(),
    body('last_name').notEmpty().isAlphanumeric(),
    body('first_name').notEmpty().isAlphanumeric(),
    body('gender').notEmpty().isAlphanumeric(),
    body('birthday').notEmpty(),
    body('age').notEmpty().isAlphanumeric(),
    body('phone').notEmpty().isAlphanumeric(),
    body('password').notEmpty().isAlphanumeric(),
    async function(req, res) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.sendStatus(400);
        }
        const id = req.params.id;
        const { email, last_name, first_name, gender, birthday, phone, password } = req.body;
        const hashedPass = bcrypt.hashSync(password, saltRounds);
        try {
            const updateUser = await UserModel.update({
                email: email,
                last_name: last_name,
                first_name: first_name,
                birthday: birthday,
                phone: phone,
                gender: gender,
                password: hashedPass
            }, {
                where: {
                    id: id
                }
            });
            res.status(200).send({ email, last_name, first_name, gender, birthday, age, phone });
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
                        userLast_Name: userInfo.last_name,
                        userFirst_Name: userInfo.first_name,
                        userGender: userInfo.gender,
                        userBirthday: userInfo.birthday,
                        userPhone: userInfo.Phone,
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