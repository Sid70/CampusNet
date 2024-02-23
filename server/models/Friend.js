const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  friendList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  chats: [
    {
      messages: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          recipient: {
            type: String, // You can use ObjectId if you have user accounts and want to link messages to users
            required: true,
          },
          message: {
            type: String,
            required: true,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

// Create a model for Friend schema 
const Friend = mongoose.model("Friend", FriendSchema);

module.exports = Friend;
