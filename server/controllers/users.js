const User = require("../models/User.js");
const Friend = require("../models/Friend.js");
const Post = require("../models/Post.js");
const bcrypt = require("bcrypt");

/* READ */

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, fullName, mobileNumber, bio, occupation, location, picturePath }) => {
        return { _id, fullName, mobileNumber, bio, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* POST */
const editUserData = async (req, res) => {

  try {
    const { email, fullName, mobileNumber, bio, occupation, location, password, _id, picturePath } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const posts = await Post.find({ userId: _id });

    for (const post of posts) {
      // Update each post's userPicturePath
      post.userPicturePath = picturePath;
      post.fullName = fullName;
      post.location = location;
      await post.save(); // Save the updated post
    }

    // Find all comments of a user
    const updatedPosts = await Post.find({ userId: _id }); // Find the posts

    if (updatedPosts) {
      for (const post of updatedPosts) {
        // Update each post's comments
        post.comments.forEach(comment => {
          if (comment.userId === _id) {
            comment.picturePath = picturePath;
            comment.fullName = fullName;
          }
        });

        // Save the updated post after updating all comments
        await post.save();
      }
    } else {
      console.log('Posts not found.');
    }

    const updatedUser = await User.findByIdAndUpdate(_id,
      {
        email,
        fullName,
        mobileNumber,
        bio,
        occupation,
        location,
        picturePath,
        password: passwordHash,
      },
      {
        new: true,
        runValidators: true,
      });

    res.json({ message: 'Data received successfully!', user: updatedUser });
  }
  catch (err) {
    res.status(404).json({ message: err.message });
  }
}

/* UPDATE */
const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      if (friend.friends.includes(id)) {
        friend.friends = friend.friends.filter((id) => id !== user.id)
      }
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    // Add new Friend inside Friend Schema
    const newUsersFriend = new Friend({
      userId: user._id,
      friendList: user.friends,
      chats: [],
    });

    const newFriendsOfUser = new Friend({
      userId: friend._id,
      friendList: friend.friends,
      chats: [],
    });

    await user.save();
    await friend.save();

    const existingUserFriend = await Friend.findOne({ userId: user._id });
    const existingFriendOfUser = await Friend.findOne({ userId: friend._id });

    if (existingFriendOfUser === null && existingUserFriend === null) {
      newFriendsOfUser.save();
      newUsersFriend.save();
      console.log('Friends documents saved successfully.');
    }
    else {
      console.log('Friend documents already exist in the database.');
      // Update the existing Friend document if needed
      if (existingUserFriend) {
        existingUserFriend.friendList = user.friends;
        await existingUserFriend.save();
        console.log('Existing user Friend document updated.');
      }
      else {
        await newUsersFriend.save()
      }

      if (existingFriendOfUser) {
        existingFriendOfUser.friendList = friend.friends;
        await existingFriendOfUser.save();
        console.log('Existing friend Friend document updated.');
      }
      else {
        await newFriendsOfUser.save();
        console.log('Existing friend Friend document updated.');
      }
    }

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, fullName, mobileNumber, occupation, location, picturePath }) => {
        return { _id, fullName, mobileNumber, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Find the friends of the user to be deleted
    const userToDelete = await User.findById(userId);
    const friendsOfUserToDelete = userToDelete.friends || [];

    // 2. Delete User's Posts
    await Post.deleteMany({ userId: userId });

    // 3. Remove Comments by the User from Posts
    await Post.updateMany(
      { 'comments.userId': userId },
      { $pull: { comments: { userId: userId } } }
    );

    // 4. Remove Likes by the User from Posts
    await Post.updateMany(
      { 'likes': { $exists: true } },
      { $unset: { [`likes.${userId}`]: '' } }
    );

    // 5. Remove User from Friend Lists
    await Friend.findOneAndDelete({ userId: userId });

    await Friend.updateMany(
      { friendList: userId },
      { $pull: { friendList: userId } }
    );

    // 6. Remove the User from friends' lists
    await User.updateMany(
      { _id: { $in: friendsOfUserToDelete } },
      { $pull: { friends: userId } }
    );

    // 7. Delete the User
    await User.findByIdAndDelete(userId);

    console.log(`Data for userId ${userId} deleted successfully from all schemas`);

    // Respond with a success message after deletion
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (err) {
    // Handle errors if deletion fails
    res.status(404).json({ message: err.message });
  }
};

/* DEACTIVATE ACCOUNT */

const deactivateAccount = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by userId and update the attributes
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 30);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isDeactivated: true,
          deactivationDate: currentDate,
          daysRemaingToDeleteAccount: 30,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with a success message after deactivation
    res.status(200).json({ message: 'User account deactivated successfully', user });
  } catch (err) {
    // Handle errors if updating attributes fails
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  getUser, getUserFriends, addRemoveFriend, editUserData, deleteAccount, deactivateAccount
};