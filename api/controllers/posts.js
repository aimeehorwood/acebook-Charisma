const Post = require("../models/post");
const TokenGenerator = require("../models/token_generator");

const PostsController = {
  Index: (req, res) => {
    Post.find(async (err, posts) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id)
      res.status(200).json({ posts: posts, token: token });
    });
  },
  Create: (req, res) => {
    const post = new Post(req.body);
    post.save(async (err) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id)
      res.status(201).json({ message: 'OK', token: token });
    });
  },
  Update: async (req, res) => {
    post_id = req.params.id
    value = req.body.value
    field = req.body.field
    if (field === 'likes') {
      const post = await Post.findOne({_id: post_id});
      const likes = post.likes.toObject();
      post.likes.includes(value) ? beenLiked = true : beenLiked = false
      beenLiked ? update = await Post.findOneAndUpdate({_id: post_id},{$pull: {likes: value}} ) : update = await Post.findOneAndUpdate({_id: post_id},{$push: {likes: value}} )
    } else if (field === 'comments') {
      update = await Post.findOneAndUpdate({_id: post_id},{$push: {comments: value}} )
    } else {
      throw err;
    }
    const token = await TokenGenerator.jsonwebtoken(req.user_id)
    res.status(200).json({ message: 'OK', token: token });
  },
  FindUsersPosts: async (req, res) => {
    const id = req.params.id;
    const posts = await Post.find({ author: id });
    const token = await TokenGenerator.jsonwebtoken(req.user_id);
    res.status(200).json({ message: "OK", token: token, posts: posts });
  },
  Delete: async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await Post.deleteOne({ _id: id });
      if (!deleted.deletedCount) {
        return res.status(404).json({ message: "Post not found" });
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ message: "OK", token: token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting post" });
    }
  }
  
};

module.exports = PostsController;




