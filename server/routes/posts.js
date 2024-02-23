const express = require("express");
const { getFeedPosts, getUserPosts, likePost, commentPost, DeleteComment , EditComment , DeletePost , EditPost } = require("../controllers/posts.js");

const router = express.Router();

/* READ */
router.get("/", getFeedPosts);

router.get("/:userId/posts", getUserPosts);

/* UPDATE */
router.patch("/:id/like", likePost);

router.patch("/:id/comments",commentPost);

router.patch("/:id/deleteComment",DeleteComment);

router.patch("/:id/editComment",EditComment);

router.patch("/:id/deletePost",DeletePost);

router.patch('/:id/EditPost',EditPost);

module.exports = router;