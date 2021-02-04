const express = require('express');
const { investment } = require('../controllers');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.use(isAuth);

router.get('/investment-attributes', investment.attributes);

module.exports = router;