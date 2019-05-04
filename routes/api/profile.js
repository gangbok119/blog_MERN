const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


const profileModel = require('../../models/Profile');
const userModel = require('../../models/User');

const authCheck = passport.authenticate('jwt', { session: false });

const validationProfileInput = require("../../validation/profile");
const validationExperiecneInput = require('../../validation/experience');
const validationEducationInput = require('../../validation/education');

const ProfileController = require('../../controllers/profile');



// @route   GET api/profile/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));


// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', authCheck, ProfileController.profile_one_get);


// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/', authCheck, ProfileController.profile_create);


// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', ProfileController.profile_handle_get);



// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', ProfileController.profile_get_byuserid);
 
// @route  POST    api/profile/experience
// @desc   Add     experience to profile
// @access Private

router.post('/experience', authCheck,ProfileController.profile_experience_create );


// @route POST api/profile/education
// @desc Add education to profile
// @access Private
router.post('/education', authCheck, ProfileController.profile_education_create);

// @route Delete api/profile/experience/:exp_id
// @Delete experience from profile
// @access Private

router.delete('/experience/:exp_id', authCheck, ProfileController.profile_experience_delete);

// @route Delete api/profile/education/:edu_id
// @desc Delete education from profile
// @access Private

router.delete('/education/:edu_id', authCheck, ProfileController.profile_education_delete);


// @route Delete api/profile
// @desc Delete user and profile
// @access Private

router.delete('/', authCheck, ProfileController.profile_delete);

module.exports = router;