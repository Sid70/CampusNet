const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const userRoutes = require("./routes/users.js");
const postRoutes = require("./routes/posts.js");
const { createPost } = require("./controllers/posts.js");
const { register } = require("./controllers/auth.js");
const { login } = require("./controllers/auth.js");
const chatRoutes = require("./routes/chat.js");
const User = require("./models/User.js");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const ReactivateUser = require("./models/ReactivateUser.js");
const cron = require('node-cron');
const Post = require("./models/Post.js");
const Friend = require("./models/Friend.js");


dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// Enable CORS for all routes (you can set specific origins if needed)
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });


/* ROUTES WITH FILES */

// For Registration of Users
app.post("/auth/register", upload.single("picture"), register);

// For User Login
app.post("/auth/login", login);

// For Forget Password
// Configure nodemailer with environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

let otpMap = new Map(); // Map to store email-otp pairs, ideally should be stored in a persistent databasez

app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email });

        if (user === null) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Generate a random OTP
        const otp = randomstring.generate({
            length: 6,
            charset: 'numeric',
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'CampusNet: Password Reset',
            text: `Dear ${user.fullName},
  
                You have requested to reset your password for the CampusNet account. Please use the following OTP (One-Time Password) to complete the password reset process: OTP: ${otp}
  
                If you did not initiate this password reset request, please contact us at support@CampusNet.com. No changes will be made to your account.
  
      Thank you,
      The CampusNet Team
      ${process.env.EMAIL_ADDRESS}`,
        };

        // Send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error sending OTP' });
            } else {
                console.log('Email sent: ' + info.response);
                otpMap.set(email, otp); // Store the email-otp pair in the map (replace with DB storage)
                return res.status(200).json({ message: 'OTP sent successfully' });
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (otpMap.has(email) && otpMap.get(email) === otp) {
        otpMap.delete(email); // Remove the OTP from the map after successful verification (replace with DB storage)
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

app.post('/reset-password', async (req, res) => {
    try {
        const { email, confirmPassword } = req.body;

        // Generate a salt for hashing (fixed salt value)
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(confirmPassword, salt);

        // Update the User Model with the hashed password
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { password: passwordHash }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Reactivate Account
app.post('/reactivateAccount', async (req, res) => {
    try {
        const { fullName, mobileNumber, email, issueDescription } = req.body;

        // Check if issueDescription exists and is not empty
        if (!issueDescription || issueDescription.trim() === '') {
            return res.status(400).json({ message: 'IssueDescription is required.' });
        }

        // Check if fullName and  exist and are capitalized
        if (!fullName ||
            fullName.trim() === '' ||
            fullName.charAt(0).toUpperCase() !== fullName.charAt(0)) {
            return res.status(400).json({ message: 'Valid fullName and  are required.' });
        }

        if (!mobileNumber || mobileNumber.trim() === '') {
            return res.status(400).json({ message: 'Mobile number is required.' });
        }

        // Check if the user exists in your system
        const userExists = await User.findOne({ email: email, fullName: fullName, mobileNumber: mobileNumber }).exec();
        if (!userExists) {
            return res.status(404).json({ message: 'User not found. Please verify your email , full name and mobile number correctly' });
        }

        if (userExists.isDeactivated === false) {
            return res.status(400).json({ message: 'Your Account has already activated' });
        }

        // Save reactivation request
        const newReactivateAccountUser = new ReactivateUser({
            email,
            fullName,
            mobileNumber,
            issueDescription,
        });

        try {
            await newReactivateAccountUser.save();
        }
        catch (error) {
            return res.status(400).json({ message: 'Something Went Wrong.' });
        }

        // Update user account status
        const changeAccountStatus = await User.findOneAndUpdate(
            { email: email },
            {
                $set: {
                    isDeactivated: false,
                    deactivationDate: null,
                    daysRemaingToDeleteAccount: 30,
                },
            },
            { new: true } // To return the updated user after the update operation
        ).exec();

        if (!changeAccountStatus) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Your Account has reactivated Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Schedule a job to run every day at midnight (or any preferred time)
cron.schedule('0 0 * * *', async () => {
    try {
        const users = await User.find({ isDeactivated: true, deactivationDate: { $ne: null } });

        users.forEach(async (user) => {
            if (user.daysRemaingToDeleteAccount > 0) {
                const updatedDaysRemaining = user.daysRemaingToDeleteAccount - 1;

                // Update daysRemaingToDeleteAccount in the database
                await User.findByIdAndUpdate(user._id, { daysRemaingToDeleteAccount: updatedDaysRemaining });

                if (updatedDaysRemaining === 0) {
                    // Perform actions for permanently deleting the account
                    // For example: await User.findByIdAndDelete(user._id);
                    try {
                        const userId = user._id;

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

                    console.log(`Account deleted: ${user.email}`);
                }
            }
        });

        console.log('Scheduled task executed successfully.');
    } catch (err) {
        console.error('Scheduled task error:', err);
    }
});


// Profile Image Extracting
app.get('/assets/:image', async (req, res) => {
    const imageName = req.params.image;
    res.sendFile(path.join(__dirname, 'public/assets', imageName));
});

//Posts Image Extracting
app.get('assets/:picturePath', async (req, res) => {
    const picturePathName = req.params.picturePath;
    res.sendFile(path.join(__dirname, 'public/assets', picturePathName));
});

// For Getting User Post
app.post("/posts", upload.array("picture"), createPost);

/* ROUTES */
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/profile", userRoutes);
// For Searching
// Endpoint to handle search requests (POST method)
app.post('/home/search', async (req, res) => {
    try {
        const searchQuery = req.body.query; // Get the search query from the request body

        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query is missing' });
        }

        // Perform a search query in the database based on the first letter of fullName or 
        const searchResults = await User.find({
            $and: [
                {
                    $or: [
                        { fullName: { $regex: `^${searchQuery}`, $options: 'i' } }, // Matches the first letter of fullName
                    ]
                },
                { isDeactivated: false } // Filter out deactivated users
            ]
        }).exec();

        setTimeout(() => {
            res.json(searchResults); // Send the search results as JSON response
        }, 1000); // Simulated delay for demonstration purposes

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// For Messanger (Chat App )
app.use("/chat", chatRoutes);





/* ********************************** MongoDB Databse Program Code Start *************************************************** */
/* MONGOOSE SETUP */
const url = process.env.MONGODB_URL;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database Connected");
    })
    .catch((error) => console.log(`${error} did not connect`));

/* ********************************** MongoDB Databse Program Code End *************************************************** */


const port = process.env.port || 8000;



app.get('/', (req, res) => {
    res.send('This message from Server');
});

// Server is running on Port 8000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    console.log("SERVER IS RUNNING");
})