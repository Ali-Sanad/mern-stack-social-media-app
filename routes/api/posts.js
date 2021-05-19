const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middlewares/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

//multer********************************************************************
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image/post');
  },
  filename: function (req, file, cb) {
    const fileName = `${new Date().getTime()}_${file.originalname.replace(
      /\s+/g,
      '-'
    )}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});
/////////////////////////////////////////////////////////////////////////

//@ route          POST api/posts
//@descrption      Create post
//@access          Private
router.post(
  '/',
  upload.single('image'),
  [auth, [check('text', 'Text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      let postImage = null;
      if (!req.file) {
        postImage = null;
      } else {
        postImage = req.file.filename;
      }

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
        image: postImage,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

//@ route          Get api/posts
//@descrption      Get all posts
//@access          Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({date: -1});
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

//@ route          Get api/posts/:id
//@descrption      Get  post by id
//@access          Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({msg: 'Post not found'});
    }

    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({msg: 'Post not found'});
    }
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

//@ route          Delete api/posts/:id
//@descrption      Delete  post by id
//@access          Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check post
    if (!post) {
      return res.status(404).json({msg: 'Post not found'});
    }

    // console.log('post.user:=>', typeof post.user, post.user);
    // console.log('req.user.id:=>', typeof req.user.id, req.user.id);

    //check User
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'User is not authorized'});
    }

    await post.remove();

    res.json({msg: 'Post removed'});
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({msg: 'Post not found'});
    }

    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

//@ route          Put api/posts/like/:id
//@descrption      Like a post
//@access          Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if the post is already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({msg: 'Post already been liked before '});
    }

    //add like to the post
    post.likes.unshift({user: req.user.id});

    await post.save();

    res.json(post.likes);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({msg: 'Post not found'});
    }
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

//@ route          Put api/posts/unlike/:id
//@descrption      unlike a post
//@access          Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if the post is already been liked or not
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({msg: 'Post has not yet been liked '});
    }

    //get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({msg: 'Post not found'});
    }
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

//@ route          POST api/posts/comment/:id
//@descrption      Comment on a post
//@access          Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({errors: errors.array()});
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({msg: 'Post not found'});
      }
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

//@ route          DELETE api/posts/comment/:id/:comment_id
//@descrption      delete Comment
//@access          Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //pull out  comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //check if comment exists
    if (!comment) {
      return res.status(404).json({masg: 'Comment does not exist'});
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'User not authorized'});
    }

    //get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({msg: 'Post not found'});
    }
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
