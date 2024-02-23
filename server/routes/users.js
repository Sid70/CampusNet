const express = require("express");
const {
  getUser,
  getUserFriends,
  addRemoveFriend,
  editUserData,
  deleteAccount,
  deactivateAccount,
} = require("../controllers/users.js");
// const upload = require('../cloudinary/cloudinaryconn.js')

const router = express.Router();

/* READ */
router.get("/:id", getUser); //
router.get("/:id/friends",getUserFriends);

/* POST */
// router.post("/editUserDetails", upload.single('selectedImage'), editUserData);
router.post("/editUserDetails", editUserData);

/* UPDATE */
router.patch("/:id/:friendId", addRemoveFriend);

/* DELETE */
router.delete("/:id/deleteAccount",deleteAccount);
router.delete("/:id/deactivateAccount",deactivateAccount);

module.exports =  router;
