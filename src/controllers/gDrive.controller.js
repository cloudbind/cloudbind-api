const axios = require('axios');
const User = require('../models/user.schema');
require('dotenv').config();

// exchange authorization code for refresh token
const googleDriveRefreshToken = async (req, res) => {
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
			const user = await User.findById(req.user.id);
			user.gDriveRefreshToken = response.referesh_token;
			await user.save();

			// api response
			res.status(200).json({
				message: 'successful',
				user: user
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: error.message,
		});
	}
};

module.exports = {
	googleDriveRefreshToken,
};