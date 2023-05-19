const axios = require('axios');
const { cloudinary } = require('./../utilities/utils');
const User = require('../models/user.schema');

const searchUsers = async (req, res) => {
    try {
        const search = req.query.search;
        const queryObj = {
            isDeleted: false,
            isActivated: true,
            isVisible: true
        };

        if (
            search &&
            (search !== 'undefined' || search !== '' || search !== ' ')
        ) {
            queryObj['$or'] = [
                { username: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];

            const results = await User.find(queryObj, {
                _id: 1,
                name: 1,
                username: 1
            });

            res.status(200).json({
                message: 'users list',
                data: {
                    results
                }
            });
        } else {
            res.status(404).json({
                message: 'enter search text'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const visibilitySetting = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404).json({
                message: 'user not found'
            });
        } else {
            user.isVisible = req.body.isVisible;
            await user.save();

            res.status(200).json({
                message: 'Visibility Updated',
                data: {
                    user
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const generateTag = async (req, res) => {
    try {
        if (req.files) {
            const user = await User.findById(req.user.id);

            if (!user) {
                res.status(404).json({
                    message: 'user not found'
                });
            } else {
                const fileUrlCloudinary = await cloudinary.uploader.upload(
                    req.files['file'][0].path,
                    {
                        public_id: `cloudbind/${req.files['file'][0].filename}`
                    }
                );

                const response = await axios.post(
                    'https://senpai3003.pythonanywhere.com/face',
                    {
                        url: fileUrlCloudinary.url
                    }
                );

                user.tag = parseInt(response[0].tag);
                await user.save();

                // Delete file from server
                fs.unlinkSync(req.files['file'][0].path);

                res.status(201).json({
                    message: 'Tag generated',
                    data: user
                });
            }
        } else {
            res.status(400).json({
                message: 'Please attach file'
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    searchUsers,
    visibilitySetting,
    generateTag
};
