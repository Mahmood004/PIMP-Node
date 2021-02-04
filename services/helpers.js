const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

let helpers = {

    modifyDealRecords: (deals, user) => {

        // If deals is an array
        if (Array.isArray(deals)) {

            return deals.map(deal => {

                // if (user.user_type.role === "Admin") {
    
                //     return {
                //         ...deal.get({ plain: true }),
                //         read_only: false
                //     }
    
                // }
                
                if (deal.approved || deal.submit_by_user_id !== user.user_id) {
    
                   return {
                        ...deal.get({ plain: true }),
                        read_only: true
                    }
                    
                }
                
                else {

                    return {
                        ...deal.get({ plain: true }),
                        read_only: false
                    }
                }
            });
        
        }
        
        // If deals in an object (single record)
        else {

            // if (user.user_type.role === "Admin") {
    
            //     return {
            //         ...deals.get({plain: true}),
            //         read_only: false
            //     }

            // }

            if (deals.approved || deals.submit_by_user_id !== user.user_id) {
    
                return {
                    ...deals.get({ plain: true }),
                    read_only: true
                }
                 
            }
             
            else {

                return {
                    ...deals.get({ plain: true }),
                    read_only: false
                }
            }
        }
    },

    isSiteAdminOrCircleCreatorOrCircleAdmin: async (user, circle_id) => {

        if (user.user_type.role === 'Admin') {
            return true;
        }

        const circle_creator = await models.circle.count({
            where: {
                circle_id,
                created_by_user_id: user.user_id
            }
        });

        if (circle_creator) {
            return true;
        }

        const circle_admin = await models.circle_admin.count({
            where: {
                circle_id,
                user_id: user.user_id
            }
        });

        if (circle_admin) {
            return true;
        }

        return false;
    },

    myDeals: async (condition, interest_condition, user_id) => {

        const deals = await models.deal.findAll({
            where: condition,
            include: [
                {
                    model: models.deal_circle,
                    include: {
                        model: models.circle
                    }
                },
                {
                    model: models.user_deal_interest,
                    ...interest_condition,
                    include: {
                        model: models.interest_level
                    }
                },
                {
                    model: models.user_deal_activity
                },
                {
                    model: models.deal_category,
                    include: {
                        model: models.deal_type
                    }
                },
                {
                    model: models.deal_sub_category
                },
                {
                    model: models.deal_document,
                    where: {
                        deleted: false,
                        [Op.or]: [
                            { private: { [Op.eq]: false } },
                            {
                                [Op.and]: [
                                    { private: { [Op.eq]: true } },
                                    { submit_by_user_id: user_id }
                                ]
                            }
                        ]
                    },
                    required: false
                },
                {
                    model: models.deal_instrument
                },
                {
                    model: models.industry
                }
            ],
            order: [
                ['user_deal_activities', 'activity_date', 'DESC']
            ]
        });

        return deals;
    },

    dealFinder: async (query, interest_condition, circle_condition, type_condition, user_id) => {

        const deals = await models.deal.findAll({
            where: query,
            include: [
                {
                    model: models.deal_circle,
                    ...circle_condition,
                    include: {
                        model: models.circle
                    }
                },
                {
                    model: models.user_deal_interest,
                    ...interest_condition,
                    include: {
                        model: models.interest_level
                    }
                },
                {
                    model: models.user_deal_activity
                },
                {
                    model: models.deal_category,
                    ...type_condition,
                    include: {
                        model: models.deal_type
                    }
                },
                {
                    model: models.deal_sub_category
                },
                {
                    model: models.User
                },
                {
                    model: models.deal_document,
                    where: {
                        deleted: false,
                        [Op.or]: [
                            { private: { [Op.eq]: false } },
                            {
                                [Op.and]: [
                                    { private: { [Op.eq]: true } },
                                    { submit_by_user_id: user_id }
                                ]
                            }
                        ]
                    },
                    required: false
                },
                {
                    model: models.deal_instrument
                },
                {
                    model: models.industry
                }
            ]
        });

        return deals;
    }



}

module.exports = helpers;