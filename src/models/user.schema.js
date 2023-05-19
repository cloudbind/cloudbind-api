const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            match: [
                /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/,
                'Please enter a valid email address'
            ]
        },
        password: {
            type: String,
            trim: true
        },
        profilePicture: {
            type: String
        },
        role: {
            type: String,
            enum: ['ADMIN', 'USER']
        },
        loginProvider: {
            type: String,
            enum: ['CLOUD BIND', 'GOOGLE']
        },
        friends: {
            type: [
                {
                    _id: String,
                    name: String,
                    username: String,
                    media: [
                        {
                            id: String,
                            url: String
                        }
                    ]
                }
            ]
        },
        friendRequests: {
            type: [
                {
                    _id: String,
                    name: String,
                    username: String
                }
            ]
        },
        friendRequestsSent: {
            type: [
                {
                    _id: String,
                    name: String,
                    username: String
                }
            ]
        },
        groups: {
            type: [String]
        },
        gDriveRefreshToken: {
            type: String
        },
        tag: {
            type: Number
        },
        isVisible: {
            type: Boolean,
            default: false
        },
        isActivated: {
            type: Boolean,
            default: false
        },
        isdeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const User = mongoose.model('user', userSchema);

module.exports = User;
