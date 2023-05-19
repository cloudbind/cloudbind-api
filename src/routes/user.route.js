const express = require('express');
const auth = require('./../middlewares/authentication.middleware');
const upload = require('../configs/multer');
const {
    searchUsers,
    visibilitySetting,
    generateTag
} = require('../controllers/user.controller');

const router = express.Router();

router.get('', [auth.verifyJwt, auth.accountActivatedTrue], searchUsers);

router.patch(
    '/setting/visibility',
    [auth.verifyJwt, auth.accountActivatedTrue],
    visibilitySetting
);

router.post(
    '/tag',
    [auth.verifyJwt, auth.accountActivatedTrue],
    upload.fields([
        {
            name: 'file',
            maxCount: 1
        }
    ]),
    generateTag
);

module.exports = router;
