const Post = require("../models/Post.js");
const User = require("../models/User.js");

/* CREATE */
const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;


    // //Add the path in an array
    // let cloudinaryPicturePath = [];
    // cloudinaryPicturePath.push(...req.files.map((file) => file.path));
    // console.log(picturePath)


    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      fullName: user.fullName,
      occupation: user.occupation,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      // picturePath:cloudinaryPicturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
const getFeedPosts = async (req, res) => {
  try {
    // Find all posts
    const posts = await Post.find();

    // Find all active users
    const activeUsers = await User.find({ isDeactivated: false });

    // Filter posts by active users
    const feedPosts = posts.filter(post => activeUsers.some(user => user._id.equals(post.userId)));

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const commentDetails = req.body;

    const userId = commentDetails['userId'];
    const text = commentDetails['comment'];

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(userId);

    const timestamp = new Date().toISOString();

    const newComment = {
      userId: userId,
      fullName: user.fullName,
      occupation: user.occupation,
      picturePath: user.picturePath,
      commentText: text,
      timestamp: timestamp,
    };

    post.comments.push(newComment);

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const DeleteComment = async (req, res) => {
  const { id } = req.params;
  const commentDetails = req.body;

  const LogInuser = commentDetails['userId'];
  const index = commentDetails['index'];

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Check if the comments array exists in the object
  if (!post.comments || !Array.isArray(post.comments)) {
    return res.status(400).json({ message: 'Invalid post or comments array' });
  }

  if (post.userId === LogInuser) {
    post.comments.splice(index, 1);
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  }
  else if (post.comments[index].userId == LogInuser) {
    post.comments.splice(index, 1);
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  }
  else {
    return res.status(400).json({ message: 'Invalid index' });
  }
}

const EditComment = async (req, res) => {
  try {
    const { id } = req.params;  // Post id
    const commentDetails = req.body;

    const LogInuser = commentDetails['userId'];
    const index = commentDetails['index'];
    const editCommentTxt = commentDetails['editcomment'];

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(LogInuser);

    const timestamp = new Date().toISOString();

    const newComment = {
      userId: LogInuser,
      fullName: user.fullName,
      occupation: user.occupation,
      picturePath: user.picturePath,
      commentText: editCommentTxt,
      timestamp: timestamp,
    };


    if (post.userId === LogInuser || post.comments[index].userId === LogInuser) {
      post.comments.splice(index, 1);
      post.comments.splice(index, 0, newComment);
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } else {
      return res.status(400).json({ message: "Invalid index or ownership" });
    }

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

const DeletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

const EditPost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    const post = await Post.findByIdAndUpdate(id, updateFields, { new: true });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json({ message: "Updated successfuly." })
  } catch (err) {
    console.error('Error editing post:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPost, getFeedPosts, getUserPosts, likePost, commentPost, DeleteComment, EditComment, DeletePost, EditPost
};