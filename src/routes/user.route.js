const express = require('express');
const auth = require('./../middlewares/authentication.middleware');
const {
    searchUsers,
    visibilitySetting
} = require('../controllers/user.controller');

const router = express.Router();

router.get('', [auth.verifyJwt, auth.accountActivatedTrue], searchUsers);

router.patch(
    '/setting/visibility',
    [auth.verifyJwt, auth.accountActivatedTrue],
    visibilitySetting
);

module.exports = router;
