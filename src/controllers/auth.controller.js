const axios = require('axios');
const Auth = require('./../models/auth.schema');
const User = require('./../models/user.schema');
const {
    sendEmailOtp,
    hashPassword,
    validatePassword,
    generateBearerToken
} = require('./../utilities/utils');
const dotenv = require('dotenv').config();

const googleSignIn = async (req, res) => {
    try {
        if (req.body.accessToken && req.body.accessToken !== null) {
            const userProfile = await axios.get(
                'https://www.googleapis.com/userinfo/v2/me',
                {
                    headers: {
                        Authorization: 'Bearer ' + req.body.accessToken
                    }
                }
            );

            const user = await User.findOne({
                email: userProfile.data.email,
                isDeleted: false
            });

            if (user && user !== null) {
                if (user.loginProvider === 'GOOGLE') {
                    const { token, expireDate } = await generateBearerToken(
                        user
                    );
                    res.status(200).json({
                        data: {
                            user,
                            token,
                            expireDate
                        }
                    });
                } else {
                    res.status(403).json({
                        message: 'Login using email and password'
                    });
                }
            } else {
                const newUser = new User({
                    name: userProfile.data.name,
                    username: null,
                    email: userProfile.data.email,
                    profilePicture: userProfile.data.picture,
                    role: 'USER',
                    loginProvider: 'GOOGLE',
                    isActivated: false
                });

                await newUser.save();

                const { token, expireDate } = await generateBearerToken(
                    newUser
                );

                res.status(201).json({
                    message: 'User registered!',
                    data: {
                        user: newUser,
                        token,
                        expireDate
                    }
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const signUp = async (req, res) => {
    try {
        const hashedPassword = hashPassword(req.body.password);

        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: 'USER',
            loginProvider: 'CLOUD BIND',
            isActivated: false
        });

        await newUser.save();

        const auth = await sendEmailOtp(req, newUser);

        const { token, expireDate } = await generateBearerToken(newUser);

        res.status(201).json({
            message: 'User registered',
            data: {
                authEmailId: auth._id,
                user: newUser,
                token,
                expireDate
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            isDeleted: false
        });

        if (!user) {
            res.status(404).json({
                message: 'Invalid email or password'
            });
        } else {
            if (!validatePassword(req.body.password, user.password)) {
                res.status(404).json({
                    message: 'Invalid email or password'
                });
            } else {
                const { token, expireDate } = await generateBearerToken(user);

                res.status(200).json({
                    data: {
                        user,
                        token,
                        expireDate
                    }
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const authEmail = await Auth.findById(req.body.authEmailId);

        if (!authEmail) {
            res.status(404).json({
                message: 'Email OTP not found'
            });
        } else {
            let user = await User.findOne({
                _id: authEmail.user.id,
                isDeleted: false
            });

            if (!user) {
                res.status(404).json({
                    message: 'User not found'
                });
            } else {
                if (authEmail.token !== req.body.emailOtp) {
                    res.status(400).json({
                        message: 'Invalid OTP'
                    });
                } else {
                    user = await User.findByIdAndUpdate(
                        user._id,
                        { isActivated: true },
                        { new: true }
                    );

                    await Auth.findByIdAndUpdate(authEmail._id, {
                        isExpired: true
                    });

                    await Auth.findByIdAndUpdate(req.token._id, {
                        isExpired: true
                    });

                    const { token, expireDate } = await generateBearerToken(
                        user
                    );

                    res.status(200).json({
                        message: 'Email verified successfully',
                        data: {
                            user,
                            token,
                            expireDate
                        }
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const setUsername = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.user.id, isDeleted: false });

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            user = await User.findByIdAndUpdate(
                user._id,
                { username: req.body.username, isActivated: true },
                { new: true }
            );

            await Auth.findByIdAndUpdate(req.token._id, { isExpired: true });

            const { token, expireDate } = await generateBearerToken(req, user);

            res.status(200).json({
                message: 'Username set successfully',
                data: {
                    user,
                    token,
                    expireDate
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const sendOtpEmail = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id, isDeleted: false });

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            const auth = await sendEmailOtp(req, user);

            await Auth.findByIdAndUpdate(req.token._id, { isExpired: true });

            const { token, expireDate } = await generateBearerToken(user);

            res.status(201).json({
                message: 'OTP sent successfully!',
                data: {
                    authEmailId: auth._id,
                    user,
                    token,
                    expireDate
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
    googleSignIn,
    signUp,
    login,
    verifyOtp,
    setUsername,
    sendOtpEmail
};
