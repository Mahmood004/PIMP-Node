const sequelize = require('sequelize');
const models = require('../models');
const statusCodes = require('../config/statusCodes');

const { OK } = statusCodes;

exports.attributes = async (req, res, next) => {

    try {

        const Op = sequelize.Op;

        const attributes = await models.user_profile_attribute.findAll({
            where: {
                [Op.or]: [
                    {
                        attribute_name: { 
                            [Op.eq]: 'investments_per_year'
                        }
                    },
                    {
                        attribute_name: {
                            [Op.eq]: 'investment_amount_per_deal'
                        }
                    }
                ]
            }
        });

        res.status(OK).send({
            success: true,
            attributes,
            message: statusCodes.getStatusText(OK)
        });

    } catch (err) {
        next(err);
    }
}