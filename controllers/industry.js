const models = require('../models');
const statusCodes = require('../config/statusCodes');

const { OK } = statusCodes;

exports.industries = async (req, res, next) => {

    try {

        const industries = await models.industry.findAll({})

        res.status(OK).send({
            error: true,
            message: statusCodes.getStatusText(OK),
            industries
        });

    } catch (err) {
        next(err);
    }
}