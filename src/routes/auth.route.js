const express = require('express');
const auth = require('./../middlewares/authentication.middleware'); 
const {
    googleSignIn,
    signUp,
    login,
    verifyOtp,
    setUsername,
    sendOtpEmail
} = require('./../controllers/auth.controller');

// Initializing router
const router = express.Router();

router.post('/google/signin', googleSignIn);

router.post('/signup', signUp);

router.post('/login', login);

router.post('/verifyOtp', [auth.verifyJwt, auth.accountActivatedFalse, auth.loginProviderCloudBind], verifyOtp);

router.post('/setUsername', [auth.accountActivatedFalse, auth.accountActivatedFalse, auth.loginProviderGoogle], setUsername);

router.post('/emailOtp', [auth.verifyJwt, auth.accountActivatedFalse, auth.loginProviderCloudBind], sendOtpEmail);

module.exports = router;