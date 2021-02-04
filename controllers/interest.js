const models = require('../models');
const statusCodes = require('../config/statusCodes');

const { OK } = statusCodes;

exports.interests = async (req, res, next) => {

    try {

        const interests = await models.interest_level.findAll({});

        res.status(OK).send({
            success: true,
            message: statusCodes.getStatusText(OK),
            interests
        });

    } catch (err) {
        next(err);
    }
}