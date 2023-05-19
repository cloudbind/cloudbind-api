const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
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
        url: {
            type: String
        },
        groupId: {
            type: String
        },
        tags: {
            type: [String]
        },
        isdeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Media = mongoose.model('media', mediaSchema);

module.exports = Media;
