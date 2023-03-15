const express = require('express');
const auth = require('./../middlewares/authentication.middleware');
const {
    createGroup,
    joinGroup
} = require('../controllers/group.controller');

const router = express.Router();

router.post('/create', [auth.verifyJwt, auth.accountActivatedTrue], createGroup);

router.post(
    '/join',
    [auth.verifyJwt, auth.accountActivatedTrue],
    joinGroup
);

module.exports = router;
