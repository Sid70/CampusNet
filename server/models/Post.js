const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  picturePath: {
    type: String,
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
},
{ timestamps: true });


const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: {
      type: [String],
    },
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;