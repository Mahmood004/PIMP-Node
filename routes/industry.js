const express = require('express');
const { industry } = require('../controllers');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/industries', industry.industries);

module.exports = router;