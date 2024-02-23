const User = require("../models/User.js");
const Friend = require("../models/Friend.js");

var senderID = "";


const getFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    senderID = id;

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath , occupation }) => {
        return { _id, firstName, lastName, picturePath , occupation };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

const sendMessages = async (req, res) => {

  try {
    const { senderId, recipient, content, timestamp } = req.body;

    const Sender = await Friend.findOne({ userId: senderId });

    const messageTimestamp = new Date(timestamp);

    Sender.chats.push({ messages: [{ sender: senderId, recipient: recipient, message: content, timestamp: messageTimestamp }] });


    // Save the changes to the database
    await Sender.save();
    return res.status(200).json({ message: 'Message sent successfully' });
  }
  catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const fetchMessages = async (req, res) => {
  try {
    const { id } = req.params;  // Id : Receiver Id or Admin wants to send a Message to His friend
    const loggedInUserId = senderID; // Assuming the logged-in user ID is available in req.userId

    const senderMessage = await Friend.findOne({ userId: loggedInUserId });

    const getSenderMessages = [];
    const getRecipientMessages = [];

    senderMessage.chats.forEach((user) => {
      user.messages.forEach((chat) => {
        if (id === chat.recipient) {
          const messageObject = {
            senderId: chat.sender,
            recipient: chat.recipient,
            chat: chat.message,
            time: chat.timestamp,
          };
          getSenderMessages.push(messageObject);
        }
      })
    });

    const RecipientMessage = await Friend.findOne({ userId: id });
    RecipientMessage.chats.forEach((user) => {
      user.messages.forEach((chat) => {
        if (chat.recipient === loggedInUserId ) {
          const messageObject = {
            senderId: chat.sender,
            recipient: chat.recipient,
            chat: chat.message,
            time: chat.timestamp,
          };
          getRecipientMessages.push(messageObject);
        }
      })
    });
    return res.status(200).json([{ senderMessages: getSenderMessages, recipientMessages: getRecipientMessages }]);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { getFriends, sendMessages, fetchMessages };