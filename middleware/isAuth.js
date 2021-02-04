const jwt = require('jsonwebtoken');
const config = require('../config');
const statusCodes = require('../config/statusCodes');
const models = require('../models');

const { UNAUTHENTICATED, NOT_FOUND } = statusCodes;

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(NOT_FOUND).send({
            error: true,
            message: 'Authorization Header Missing!'
        })
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(NOT_FOUND).send({
            error: true,
            message: 'Token must be non-null!'
        });
    }

    jwt.verify(token, config.secretKey, async (err, decodedToken) => {
        
        if (err) {
            return res.status(UNAUTHENTICATED).send({
                error: true,
                message: `${err.name + ':' + err.message}`
            });
        }

        const user = await models.User.findOne({
            where: {
                user_id: decodedToken.id
            },
            include: [
                {
                    model: models.user_type
                },
                {
                    model: models.user_circle
                }
            ]
        });
    
        if (!user) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User Not Found!'
            });
        }
    
        req.user = user;
        next();
    });
    

    
}