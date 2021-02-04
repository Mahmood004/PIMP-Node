const statusCodes = require('../config/statusCodes');

const { FORBIDDEN } = statusCodes;

module.exports = (req, res, next) => {
        
    if (req.user.user_type.role !== 'Admin') {
        return res.status(FORBIDDEN).send({
            error: true,
            message: 'Permission Denied!'
        });
    }
    next();
}