const mongoose = require("mongoose");

//Define Schema for a user
// This Schema Help us for Feedback
const ReactivateUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            max: 50,
        },
        mobileNumber: {
            type: String,
            require : true,
            max: 16,
        },
        fullName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        issueDescription: {
            type: String,
            required: true,
            min: 0,
            max: 500,
        }
    },
    { timestamps: true }
);
// Create a model for user schema 
const ReactivateUser = mongoose.model("ReactivateUser", ReactivateUserSchema);

module.exports = ReactivateUser;
