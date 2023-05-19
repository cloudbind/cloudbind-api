const express = require('express');
const auth = require('../middlewares/authentication.middleware');
const upload = require('../configs/multer');
const {
    gDriveRefreshToken,
    gDriveUpload
} = require('../controllers/gDrive.controller');

const router = express.Router();

router.post(
    '/authorization-code',
    [auth.verifyJwt, auth.accountActivatedTrue],
    gDriveRefreshToken
);

router.post(
    '/upload',
    [auth.verifyJwt, auth.accountActivatedTrue],
    upload.fields([
        {
            name: 'file',
            maxCount: 1
        }
    ]),
    gDriveUpload
);

module.exports = router;
