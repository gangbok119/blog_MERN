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
router.delete('/:id',authCheck, (req,res) =>{
    
    profileModel.findOne({user: req.user.id}).then(profile => {
        postModel.findById(req.params.id)
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

// @route POST posts/like/:id
// @desc Like post
// @access Private
router.post('/like/:id', authCheck, (req,res) => {
    profileModel.findOne({user: req.user.id})
        .then(profile => {
            postModel.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({alreadyliked: "User already liked this post"})
                    }
                    // Add user id to likes array
                    post.likes.unshift({ user: req.user.id});
                    post.save().then(post => res.json(post));
                })
                .catch(err =>res.status(404).json({ postnotfound:"No post found"}))
        })
        .catch(err => res.status(404).json({ postnotfound:"No post found"}));
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', authCheck, (req, res) => {
    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            postModel.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({
                            notliked: 'You have not liked this post'
                        });
                    }
                    // get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    // splice out of array
                    post.likes.splice(removeIndex, 1);

                    // save
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }));
    });
});



module.exports = router;