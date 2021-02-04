const auth = require('./auth');
const user = require('./user');
const deal = require('./deal');
const circle = require('./circle');
const industry = require('./industry');
const investment = require('./investment');
const interest = require('./interest');

module.exports = [
    auth,
    industry,
    deal,
    user,
    circle,
    investment,
    interest
]