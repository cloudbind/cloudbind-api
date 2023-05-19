const express = require('express');
const auth = require('./../middlewares/authentication.middleware');
const {
    createGroup,
    joinGroup,
    viewGroups,
    toggleVisibility,
    togglePhotoVisibility,
    fetchMedia
} = require('../controllers/group.controller');

const router = express.Router();

router.post(
    '/create',
    [auth.verifyJwt, auth.accountActivatedTrue],
    createGroup
);

router.post('/join', [auth.verifyJwt, auth.accountActivatedTrue], joinGroup);

router.get('/view', [auth.verifyJwt, auth.accountActivatedTrue], viewGroups);

router.patch(
    '/toggle-visibility/:id',
    [auth.verifyJwt, auth.accountActivatedTrue],
    toggleVisibility
);

router.patch(
    '/toggle-photo-visibility/:id',
    [auth.verifyJwt, auth.accountActivatedTrue],
    togglePhotoVisibility
);

router.get(
    '/media/:id',
    [auth.verifyJwt, auth.accountActivatedTrue],
    fetchMedia
);

module.exports = router;
