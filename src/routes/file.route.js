const express = require('express');
const upload = require('../configs/multer');
const { fileUpload } = require('../controllers/file.controller');

const router = express.Router();

router.post('/', upload.array('files'), fileUpload);

module.exports = router;