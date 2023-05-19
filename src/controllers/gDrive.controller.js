const axios = require('axios');
const { cloudinary } = require('./../utilities/utils');
const fs = require('fs');
const { google } = require('googleapis');
const Group = require('../models/group.schema');
const User = require('../models/user.schema');
const Media = require('../models/media.schema');
require('dotenv').config();

// exchange authorization code for refresh token
const gDriveRefreshToken = async (req, res) => {
    try {
        // initializing variables
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const authorizationCode = req.body.authorizationCode;
        const url = 'https://oauth2.googleapis.com/token';

        // request body for api call
        const requestBody = {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: authorizationCode,
            redirect_uri: 'https://developers.google.com/oauthplayground/',
            scopes: ['https://www.googleapis.com/auth/drive'],
            accessType: 'offline'
        };

        // api call using axios
        const response = await axios.post(url, requestBody);

        // error handling
        if (!response.referesh_token) {
            res.status(400).json({
                message: 'something went wrong'
            });
        } else {
            // storing refresh token in user document
            // const user = await User.findById(req.user.id);
            // user.gDriveRefreshToken = response.referesh_token;
            // await user.save();

            // api response
            res.status(200).json({
                message: 'successful',
                user: response.referesh_token
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const gDriveUpload = async (req, res) => {
    try {
        if (req.files) {
            // Fetching user data
            const user = await User.findById(req.user.id);

            // Configuration
            const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
            const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
            const REFRESH_TOKEN = user.gDriveRefreshToken;

            // Create an OAuth2 client with the given credentials
            const oAuth2Client = new google.auth.OAuth2(
                CLIENT_ID,
                CLIENT_SECRET
            );

            // Create a new instance of the Drive API
            const drive = google.drive({ version: 'v3', auth: oAuth2Client });

            // Set the refresh token for the OAuth2 client
            oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

            // Read the file data
            const file = req.files['file'][0].path;

            const response1 = await new Promise((resolve, reject) => {
                drive.files.create(
                    {
                        resource: {
                            name: req.files['file'][0].filename
                        },
                        media: {
                            mimeType: 'application/octet-stream',
                            body: fs.createReadStream(file)
                        },
                        fields: 'id, webViewLink'
                    },
                    (err, response) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(response ? response : null);
                    }
                );
            });

            // Get the file ID
            const fileId = response1.data.id;

            // Update the folder permission to make it public
            const response2 = await new Promise((resolve, reject) => {
                drive.permissions.create(
                    {
                        fileId: fileId,
                        requestBody: {
                            role: 'reader',
                            type: 'anyone'
                        }
                    },
                    (err, response) => {
                        if (err) {
                            console.error(
                                'Error changing file visibility:',
                                err
                            );
                            return reject(err);
                        }
                        resolve(response ? response : null);
                    }
                );
            });

            const fileUrlCloudinary = await cloudinary.uploader.upload(
                req.files['file'][0].path,
                {
                    public_id: `cloudbind/${req.files['file'][0].filename}`
                }
            );

            // Face Recognition
            const response3 = await axios.post(
                'https://senpai3003.pythonanywhere.com/face',
                {
                    url: fileUrlCloudinary.url
                }
            );

            let media = {};
            if (req.body.type == 'GROUP') {
                media = new Media({
                    parent: {
                        id: req.user.id,
                        name: req.user.name,
                        username: req.user.username,
                        email: req.user.email,
                        profilePicture: req.user.profilePicture
                    },
                    url: response1.data.webViewLink,
                    groupId: req.body.groupId,
                    tags: response3.data.tag
                });

                const group = await Group.findById(req.body.groupId);

                for (const item of group.users) {
                    let tempUser = await User.findById(item.id);

                    response3.data.tag.forEach((itemInception) => {
                        if (parseInt(itemInception) == tempUser.tag) {
                            item.media.push({ id: media._id, url: media.url });
                        }
                    });
                }

                await group.save();
            } else if (req.body.type == 'FRIEND') {
                media = new Media({
                    parent: {
                        id: req.user.id,
                        name: req.user.name,
                        username: req.user.username,
                        email: req.user.email,
                        profilePicture: req.user.profilePicture
                    },
                    url: response1.data.webViewLink,
                    tags: response3.data.tag
                });

                for (const item of req.body.userIds) {
                    let tempUser = await User.findById(item);

                    response3.data.tag.forEach((itemInception) => {
                        if (parseInt(itemInception) == tempUser.tag) {
                            tempUser.friends.forEach((itemDoubleInception) => {
                                if (itemDoubleInception._id == req.user.id) {
                                    itemDoubleInception.media.push({
                                        id: media._id,
                                        url: media.url
                                    });
                                }
                            });
                        }
                    });

                    await tempUser.save();
                }
            }

            // Save to db
            await media.save();

            // Delete file from server
            fs.unlinkSync(req.files['file'][0].path);

            // api response
            res.status(200).json({
                message: 'successful',
                user: user
            });
        } else {
            // api response
            res.status(400).json({
                message: 'Please attach files'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    gDriveRefreshToken,
    gDriveUpload
};
