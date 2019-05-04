
// Post model
const postModel = require("../models/Post");
// profile model
const profileModel = require("../models/Profile");


// Validation 
const validatePostInput = require("../validation/post");


module.exports = {
    post_create:(req,res) =>{
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
    },
    postread:(req,res) => {
        postModel.find()
            .sort({ date: -1})// 최신순
            .then(posts => res.json(posts))
            .catch(err => {
                res.status(404).json({ nopostsfound: 'No posts found'})
            });
    },
    post_one_read:(req,res)=> {
        postModel.findById(req.params.id)
            .then(post => res.json(post))
            .catch(err => res.status(404).json({
                nopostsfound:'No post found with that ID'
            }));
    },
    post_delete:(req,res) =>{
    
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
    
    },
    post_like:(req,res) => {
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
    },
    post_unlike:(req, res) => {
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
    },
    post_comment_create:(req,res) =>{
        const {errors, isValid} = validatePostInput(req.body);
    
        // check validation
        if (!isValid) {
            // if any errors, send 400 with errors object
            return res.status(400).json(errors);
        }
    
        postModel.findById(req.params.id)
            .then(post => {
                const newComment ={
                    text:req.body.text,
                    name:req.body.name,
                    avatar:req.body.avatar,
                    user:req.user.id
                };
                // add to comments array
                post.comments.unshift(newComment);
                // save
                post.save().then(post => res.json(post));
    
            })
            .catch(err => res.status(404).json({postnotfound:'No post found'}))
    },
    post_comment_delete:(req,res) => {
        postModel.findById(req.params.id)
            .then(post => {
                if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                    return res.status(404).json({commentnotexists:"Comment does not exist"});
                }
                // get remove index
                const removeIndex = post.comments
                    .map(item => item._id.toString())
                    .indexOf(req.params.comment_id);
                // splice comment out of array
                post.comments.splice(removeIndex,1);
                post.save().then(post => res.json(post));
            });
    }
}