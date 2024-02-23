const bcrypt = require("bcrypt");
const User = require("../models/User.js");

/* REGISTER USER */
const register = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      bio,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);


    const ExistUser = await User.findOne({ email });

    if (ExistUser) {
      return res.status(404).json({ error: "Email Id is already registered." });
    }

    const newUser = new User({
      fullName,
      mobileNumber,
      bio,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = user._id;
    delete user.password;

    const userData = {
      token,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        bio: user.bio,
        picturePath: user.picturePath,
        friends: user.friends,
        occupation: user.occupation,
        location: user.location,
        isDeactivated: user.isDeactivated,
        deactivationDate: user.deactivationDate,
        daysRemaingToDeleteAccount: user.daysRemaingToDeleteAccount,
      }
    }
    // Respond with the token and other user data (without sensitive information)
    res.status(200).json(userData);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong during login." });
  }
};

module.exports = {
  register,
  login
};