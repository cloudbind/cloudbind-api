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

            if (results.length === 0) {
                res.status(404).json({
                    message: 'user not found'
                });
            } else {
                res.status(200).json({
                    message: 'users list',
                    data: {
                        results
                    }
                });
            }
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

module.exports = {
    searchUsers,
    visibilitySetting
};
