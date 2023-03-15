const express = require('express');
const auth = require('./../middlewares/authentication.middleware');
const {
    createGroup,
    joinGroup,
    viewGroups
} = require('../controllers/group.controller');

const router = express.Router();

router.post('/create', [auth.verifyJwt, auth.accountActivatedTrue], createGroup);

router.post(
    '/join',
    [auth.verifyJwt, auth.accountActivatedTrue],
    joinGroup
);

router.get(
    '/view',
    [auth.verifyJwt, auth.accountActivatedTrue],
    viewGroups
);

module.exports = router;
