const User = require('./../models/user.schema');

const sendFriendRequest = async (req, res) => {
    try {
        const userSending = await User.findById(req.user.id);
        const userReceiving = await User.findById(req.query.id);

        if (
            !userReceiving ||
            userReceiving.isDeleted === true ||
            userReceiving.isActivated === false ||
            userReceiving.isVisible === false
        ) {
            res.status(404).json({
                message: 'user not found'
            });
        } else {
            userSending.friendRequestsSent.push({
                _id: userReceiving._id,
                name: userReceiving.name,
                username: userReceiving.username
            });

            userReceiving.friendRequests.push({
                _id: userSending._id,
                name: userSending.name,
                username: userSending.username
            });

            await userSending.save();
            await userReceiving.save();

            res.status(200).json({
                message: 'friend request sent'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const userSending = await User.findById(req.query.id);
        const userReceiving = await User.findById(req.user.id);

        if (
            !userSending ||
            userSending.isDeleted === true ||
            userSending.isActivated === false
        ) {
            res.status(404).json({
                message: 'user not found'
            });
        } else {
            userSending.friendRequestsSent =
                userSending.friendRequestsSent.filter(
                    (friendRequestSent) => friendRequestSent._id !== req.user.id
                );

            userReceiving.friendRequests = userReceiving.friendRequests.filter(
                (friendRequest) => friendRequest._id !== req.query.id
            );

            userSending.friends.push({
                _id: userReceiving._id,
                name: userReceiving.name,
                username: userReceiving.username
            });

            userReceiving.friends.push({
                _id: userSending._id,
                name: userSending.name,
                username: userSending.username
            });

            await userSending.save();
            await userReceiving.save();

            res.status(200).json({
                message: 'friend request accepted'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getFriendsList = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({
                message: 'user not found'
            });
        } else {
            const friends = user.friends;
            res.status(200).json({
                message: 'friends list',
                data: {
                    friends
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({
                message: 'user not found'
            });
        } else {
            const friendRequests = user.friendRequests;
            res.status(200).json({
                message: 'friend requests',
                data: {
                    friendRequests
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getFriendRequestsSent = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({
                message: 'user not found'
            });
        } else {
            const friendRequestsSent = user.friendRequestsSent;
            res.status(200).json({
                message: 'friend requests sent',
                data: {
                    friendRequestsSent
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    getFriendsList,
    getFriendRequests,
    getFriendRequestsSent
};
