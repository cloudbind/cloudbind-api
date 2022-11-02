const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const User = require('./../models/user.schema');
const { generateBearerToken } = require('./../utilities/utils');
const dotenv = require('dotenv').config();

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    cb(null, user);
});

// Configuring passport microsoft startegy
passport.use(new Strategy(
    {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
        scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
        // const user = await User.findOne({ email: profile.emails[0].value });
        
        // if (user && user !== null) {
        //     const  { token, expireDate } = generateBearerToken(user);
        //     if (user.isActivated === true) {
        //         return done(null, { ...user.toObject(), isActivated: true, token: token, expireDate: expireDate });
        //     } else {
        //         return done(null, { ...user.toObject(), isActivated: false, token: token, expireDate: expireDate });
        //     }
        // }
        // else {
        //     const user = new User(
        //         {
        //             name: profile.displayName,
        //             email: profile.emails[0].value,
        //             isActivated: false
        //         }
        //     );
        //     await user.save();

        //     const  { token, expireDate } = generateBearerToken(user);
        //     return done(null, { ...user?.toObject(), isActivated: false, token: token, expireDate: expireDate });
        // }
        console.log(accessToken);
        return done(null);
    }
));