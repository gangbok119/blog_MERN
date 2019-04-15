const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const authCheck = passport.authenticate('jwt', { session:false});

const userModel = require("../../models/User");



router.get('/test', (req,res) => res.json({ msg: 'Users Works'}));

// user registration
router.post('/register',(req,res) => {
    userModel
        .findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    email: 'Email already exists'
                });
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // size
                    r: 'pg',  // rating
                    d: 'mm' // default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err,hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => res.json(err));
                    });
                });
            }
        })
        .catch(err => res.json(err))
});

// login
router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({ email })
        .then(
            user => {
                if(!user) {
                    return res.status(404).json({
                        emal: 'User not found'
                    });
                } else {
                    bcrypt
                        .compare(password, user.password)
                        .then(isMatch => {
                            if (isMatch) {
                                const payload = { id: user.id, name:user.name, avatar:user.avatar};

                                jwt.sign(
                                    payload,
                                    keys.secretOrkey,
                                    { expiresIn: 3600 },
                                    (err, token) => {
                                        res.json({
                                            success:true,
                                            token:'Bearer ' + token
                                        });
                                    }
                                );
                            } else {
                                return res.status(400).json({
                                    password: 'Password incorrect'
                                });
                            }
                        })
                        .catch(err => res.json(err));
                }
            }
        )
        .catch(err => res.json(err));
});

// current user
router.get('/current', authCheck, (req,res) => {
    res.json({
        id:req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;