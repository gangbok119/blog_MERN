const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post model
const postModel = require("../../models/Post");
// profile model
const profileModel = require("../../models/Profile");


// Validation 
const validatePostInput = require("../../validation/post");

const authCheck = passport.authenticate('jwt', {session:false});





// @route POST api/posts
// @desc Create post
// @access Private

router.post('/', authCheck, (req,res) =>{
    const { errors, isValid} = validatePostInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const newPost = new postModel({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    });

    newPost.save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json(err));
});

// @route GET posts/
// @desc Get posts
// @access Public
router.get('/', (req,res) => {
    postModel.find()
        .sort({ date: -1})// 최신순
        .then(posts => res.json(posts))
        .catch(err => {
            res.status(404).json({ nopostsfound: 'No posts found'})
        });
});

// @route GET posts/:id
// @desc Get post by id
// @access Public

router.get('/:id', (req,res)=> {
    postModel.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
            nopostsfound:'No post found with that ID'
        }));
});

// @route DELETE posts
// @desc Delete posts
// @access Private
router.delete('/:postId',authCheck, (req,res) =>{
    
    profileModel.findOne({user: req.user.id}).then(profile => {
        postModel.findById(req.params.postId)
        .then(post => {
            //check for post owner
            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({ noauthorized: 'User not authorized'});
            }
            post.remove().then(() => res.json({success: true}));
        })
        .catch(err => res.status(404).json({
            nopostsfound:'No post found'
        }));
    });

});


module.exports = router;