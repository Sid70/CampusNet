const mongoose = require("mongoose");

//Define Schema for a user
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    mobileNumber: {
      type: String,
      required: true,
      min: 10,
      max: 16,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    bio: String,
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    isDeactivated: {
      type: Boolean,
      default: false,
    },
    deactivationDate: {
      type: Date,
      default: null,
    },
    daysRemaingToDeleteAccount: {
      type: Number,
      default: 30,
    }
  },
  { timestamps: true }
);
// Create a model for user schema 
const User = mongoose.model("User", UserSchema);

module.exports = User;
