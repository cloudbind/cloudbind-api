const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
    {
        parent: {
            type: {
                id: {
                    type: String
                },
                name: {
                    type: String
                },
                username: {
                    type: String
                },
                email: {
                    type: String
                },
                profilePicture: {
                    type: String
                }
            }
        },
        name: {
            type: String
        },
        code: {
            type: Number
        },
        users: {
            type: [
                {
                    id: {
                        type: String
                    },
                    name: {
                        type: String
                    },
                    username: {
                        type: String
                    },
                    email: {
                        type: String
                    },
                    profilePicture: {
                        type: String
                    },
                    media: {
                        type: [
                            {
                                id: String,
                                url: String
                            }
                        ]
                    }
                }
            ]
        },
        isVisible: {
            type: Boolean,
            default: false
        },
        photoVisibility: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Group = mongoose.model('group', groupSchema);

module.exports = Group;
