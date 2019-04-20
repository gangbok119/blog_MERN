const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const passport = require("passport");

const profileModel = require("../../models/Profile");
const userModel = require("../../models/User");

const authCheck = passport.authenticate('jwt', { session:false });

router.get('/', authCheck, (req,res) => {
    const errors ={};

    profileModel.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile';
                return res.status(404).json(
                    errors
                )
            } else {
                return res.json(profile);
            }
        })
        .catch(
            err => res.json(err)
        );
});

module.exports = router;