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

const PostController = require('../../controllers/posts');




// @route POST api/posts
// @desc Create post
// @access Private

router.post('/', authCheck,PostController.post_create);

// @route GET posts/
// @desc Get posts
// @access Public
router.get('/', PostController.postread);

// @route GET posts/:id
// @desc Get post by id
// @access Public

router.get('/:id', PostController.post_one_read);

// @route DELETE posts
// @desc Delete posts
// @access Private
router.delete('/:id',authCheck, PostController.post_delete);

// @route POST posts/like/:id
// @desc Like post
// @access Private
router.post('/like/:id', authCheck, PostController.post_like);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', authCheck, PostController.post_unlike);

// @route POST posts/comment/:id
// @desc Add comment to post
// @access Private
router.post('/comment/:id', authCheck, PostController.post_comment_create);

// @route DELETE posts/comment/:id/:comment_id
// @desc Remove comment from post
// @access Private

router.delete('/comment/:id/:comment_id', authCheck, PostController.post_comment_delete);


module.exports = router;