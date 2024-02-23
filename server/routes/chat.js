const express = require("express");
const { getFriends } = require("../controllers/chats");
const { sendMessages } = require("../controllers/chats");
const { fetchMessages } = require("../controllers/chats");

const router = express.Router();
/* READ */
router.get("/:id/getfriends", getFriends);

// Store Data
router.post("/sendMessages",sendMessages);

// fetch Messages
router.get("/messages/:id",fetchMessages);



module.exports = router;
