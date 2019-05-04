
const profileModel = require('../../models/Profile');
const userModel = require('../../models/User');

const validationProfileInput = require("../../validation/profile");
const validationExperiecneInput = require('../../validation/experience');
const validationEducationInput = require('../../validation/education');

module.exports = {
    profile_one_get:(req, res) => {

        const errors = {};
    
        profileModel.findOne({ user: req.user.id })
            .populate('user', ['name','avatar'])
            .then(profile => {
                if (!profile) {
                    errors.noprofile = 'There is no profile for this user';
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.json(err));
    
    },
    profile_create:(req, res) => {


        const { errors, isValid} = validationProfileInput(req.body);
    
            if (!isValid) {
                return res.status(400).json(errors);
            }
    // Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    
        // Skills - Spilt into array
        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }
    
        // Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    
        profileModel.findOne({ user: req.user.id })
            .then(profile => {
                if (profile) {
                    // update
                    profileModel
                        .findOneAndUpdate(
                            { user: req.user.id },
                            { $set: profileFields },
                            { new: true }
                        )
                        .then(profile => res.json(profile))
                        .catch(err => res.json(err));
                } else {
                    // check if handle exists
                    profileModel
                        .findOne({ handle: profileFields.handle })
                        .then(profile => {
                            if (profile) {
                                errors.handle = 'That handle already exists';
                                res.status(400).json(errors);
                            }
                            new profileModel(profileFields)
                                .save()
                                .then(profile => res.json(profile))
                                .catch(err => res.json(err));
                        })
                        .catch(err => res.json(err));
                }
            })
            .catch(err => res.json(err));
    
    
    
    
    
    },
    profile_handle_get:(req, res) => {

        const errors = {};
        profileModel.findOne({ handle: req.params.handle })
            .populate('user', ['name', 'avatar'])
            .then(profile => {
                if (!profile) {
                    errors.noprofile = 'There is no profile for this user';
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(errors));
    },
    profile_get_byuserid:(req, res) => {
        const errors = {};
     
        profileModel.findOne({ user: req.params.user_id })
            .populate('user', ['name', 'avatar'])
            .then(profile => {
                if (!profile) {
                   errors.noprofile = 'There is no profile for this user';
                   return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json({
                profile: 'There is no profile for this user'
            }));
     },
     profile_experience_create:(req,res) => {

        const { errors, isValid } = validationExperiecneInput(req.body);
    
        // check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
    
        profileModel.findOne({user:req.user.id})
            .then(profile => {
                const newExp = {
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                };
    
                // add to exp array
                profile.experience.unshift(newExp);
                profile
                    .save()
                    .then(profile => res.json(profile))
                    .catch(err => res.status(404).json(err));
            })
            .catch(err => res.status(404).json(err))
    },
    profile_education_create:(req,res) => {
        const { errors, isValid} = validationEducationInput(req.body);
    
        // check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
    
        profileModel.findOne({user: req.user.id })
            .then(profile => {
                const newEdu = {
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                };
    
                // add to exp array
                profile.education.unshift(newEdu);
                profile
                    .save()
                    .then(profile => res.json(profile))
                    .catch(err => res.status(404).json(err));
            })
            .catch(err => res.status(404).json(err));
    },
    profile_experience_delete:(req,res) => {
        profileModel.findOne({ user: req.user.id})
            .then(profile => {
                // get remove index
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexof(req.params.exp_id);
    
                // splice out of array
                profile.experience.splice(removeIndex, 1);
                // save
                profile.save()
                    .then(profile => res.json(profile))
                    .catch(err => res.status(404).json(err)); 
            })
            .catch(err => res.status(404).json(err));
    },
    profile_education_delete:(req,res) => {
        profileModel.findOne({ uesr: req.user.id})
            .then(profile => {
                // get remove index
                const removeIndex = profile.education
                    .map(item => item.id)
                    .indexof(req.params.edu_id);
    
                // splice out of array
                profile.education.splice(removeIndex, 1);
                // save
                profile.save()
                    .then(profile => res.json(profile))
                    .catch(err => res.status(404).json(err));
    
            })
            .catch(err => res.status(404).json(err))
    },
    profile_delete:(req,res) => {
        profileModel.findByIdAndRemove({ user: req.user.id})
            .then(() => {
                userModel.findOneAndRemove({_id: req.user.id})
                    .then(() => res.json({success: true}))
                    .catch(err => res.status(404).json(err));
            })
            .catch(err => { res.status(404).json(err)});
    },

}