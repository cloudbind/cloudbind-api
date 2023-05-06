const express = require('express');
const auth = require('../middlewares/authentication.middleware');
const {
    googleDriveRefreshToken
} = require('../controllers/gDrive.controller');

const router = express.Router();

router.post(
    '/authorization-code',
    [auth.verifyJwt, auth.accountActivatedTrue],
    googleDriveRefreshToken
);

module.exports = router;