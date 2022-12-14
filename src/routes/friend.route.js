const express = require('express');
const auth = require('./../middlewares/authentication.middleware');
const {
    sendFriendRequest,
    acceptFriendRequest,
    getFriendsList,
    getFriendRequests,
    getFriendRequestsSent
} = require('../controllers/friend.controller');

const router = express.Router();

router.post(
    '/send-request',
    [auth.verifyJwt, auth.accountActivatedTrue],
    sendFriendRequest
);

router.post(
    '/accept-request',
    [auth.verifyJwt, auth.accountActivatedTrue],
    acceptFriendRequest
);

router.get('/', [auth.verifyJwt, auth.accountActivatedTrue], getFriendsList);

router.get(
    '/requests',
    [auth.verifyJwt, auth.accountActivatedTrue],
    getFriendRequests
);

router.get(
    '/requests-sent',
    [auth.verifyJwt, auth.accountActivatedTrue],
    getFriendRequestsSent
);

module.exports = router;
