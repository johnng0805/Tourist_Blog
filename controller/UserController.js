const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
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
}).single('image');

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

router.put('/userInfo', checkLogin, upload, async function(req, res) {
    //const hashedPass = bcrypt.hashSync(password, saltRounds);
    try {
        const id = req.session.User.userID.toString();
        const { email, last_name, first_name, birthday, phone, gender } = req.body;
        var image;
        if (req.file) {
            image = req.file.filename;
        } else {
            image = req.session.User.userImage;
        }
        const [ updateUser ] = await UserModel.update({
            email: email,
            last_name: last_name,
            first_name: first_name,
            birthday: birthday,
            gender: gender,
            phone: phone,
            image: image
        }, {
            where: {
                id: id
            }
        });
        if (updateUser === 1) {
            req.session.User = {
                userID: id,
                userEmail: email,
                userLast_Name: last_name,
                userFirst_Name: first_name,
                userGender: gender,
                userBirthday: birthday,
                userPhone: phone,
                userImage: image
            }
        }
        res.status(200).send({ email, last_name, first_name, birthday, phone, image, gender });
        console.log(updateUser);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get('/userInfo', checkLogin, async function(req, res) {
    const id = req.session.User.userID.toString();
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

router.get('/:id', async function(req, res) {
    const id = req.params.id;
    try {
        const userInfo = await UserModel.findOne({
            where: {
                id: id
            },
            attributes: ['id', 'last_name', 'first_name', 'birthday', 'email', 'gender', 'image']
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
                        userID: userInfo.id.toString(),
                        userEmail: userInfo.email,
                        userLast_Name: userInfo.last_name,
                        userFirst_Name: userInfo.first_name,
                        userGender: userInfo.gender,
                        userBirthday: userInfo.birthday,
                        userPhone: userInfo.phone,
                        userImage: userInfo.image
                    };
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(401);
            }
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
)

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
})


module.exports = router;