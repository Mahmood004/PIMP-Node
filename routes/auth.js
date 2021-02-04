const express = require('express');
const { auth } = require('../controllers');
const passport = require('passport');
const { baseAddress } = require('../config');

const router = express.Router();

router.post('/signup', auth.register);

router.post('/signin', auth.login);

router.get('/auth/linkedin', passport.authenticate('linkedin'));

router.get('/auth/linkedin/callback', (req, res, next) => {

    if (req.query && req.query.error) {
        res.redirect(baseAddress);
    }
    next();

}, passport.authenticate('linkedin', { session: false }), auth.linkedin);

module.exports = router;