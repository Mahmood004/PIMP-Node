const express = require('express');
const { interest } = require('../controllers');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.use(isAuth);

router.get('/interests', interest.interests);

module.exports = router;