const Group = require('../models/group.schema');
const User = require('../models/user.schema');
const { generateOtp } = require('../utilities/utils');

const createGroup = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            const code = generateOtp(8);

            const group = new Group({
                parent: {
                    id: req.user.id,
                    name: req.user.name,
                    username: req.user.username,
                    email: req.user.email,
                    profilePicture: req.user.profilePicture
                },
                name: req.body.name,
                code: code
            });

            user.groups.push(group._id)

            await user.save();
            await group.save();

            res.status(201).json({
                message: 'Group created',
                data: {
                    group
                }
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

const joinGroup = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            const group = await Group.find({ code: req.body.code });

            if (group.length == 0) {
                res.status(404).json({
                    message: 'Group not found'
                });
            } else {
                if (user.groups.includes(group[0]._id)) {
                    res.status(400).json({
                        message: 'Group already joined'
                    });
                } else {
                    user.groups.push(group[0]._id);
                    group[0].users.push({ id: user._id, name: user.name, username: user.username, email: user.email, profilePicture: user.profilePicture });

                    await user.save();
                    await group[0].save();

                    res.status(200).json({
                        message: 'Group joined',
                        data: {
                            user,
                            group
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

const viewGroups = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            const groups = [];

            for await (const item of user.groups) {
                const group = await Group.findById(item);
                groups.push(group);
            }

            res.status(200).json({
                message: 'Groups list',
                data: {
                    groups
                }
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createGroup,
    joinGroup,
    viewGroups
};