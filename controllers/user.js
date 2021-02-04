const bcrypt = require('bcryptjs');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { addUserToMailchimpList } = require('../services/mailchimp');
const { validationResult } = require('express-validator');
const Mailer = require('../services/Mailer');
const helpers = require('../services/helpers');
const models = require('../models');
const statusCodes = require('../config/statusCodes');

const { OK, NOT_FOUND, EXPECTATION_FAILED, UNAUTHENTICATED, UNPROCESSABLE_ENTITY } = statusCodes;
const { secretKey, baseAddress, resetPasswordTemplate } = require('../config');
const { modifyDealRecords, myDeals } = helpers;

const Op = sequelize.Op;

exports.users = async (req, res, next) => {

    try {

        const { approved } = req.query;

        let query = {}

        if (approved === "true") {
            query.approved = true;
        }

        if (approved === "false") {
            query.approved = false;
        }

        const users = await models.User.findAll({
            where: query,
            include: [
                {
                    model: models.user_type,
                    where: {
                        role: 'User'
                    },
                }
            ]
        });

        if (!users) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Users are failed to retrieve!' 
            });
        }

        if (users.length === 0) {
            return res.status(OK).send({
                success: true,
                users,
                message: 'No users are available!' 
            });
        }
            
        res.status(OK).send({
            success: true,
            message: 'Users retrieved successfully!',
            users
        });

    } catch (err) {
        next(err);
    }
}

exports.approveUser = async (req, res, next) => {

    try {

        const { user_id } = req.params;

        const approved = await models.User.update(
            {
                approved: 1,
                approved_by: req.user.user_id,
                approved_date: Date.now(),
            },
            {
                where: {
                    user_id
                }
            }
        );
       
        if (!approved[0]) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'User is unable to approve!'
            });
        }

        const user = await models.User.findOne({ where: { user_id } });

        addUserToMailchimpList(user).end(async (err, response) => {

            if (response.status < 300 || (response.status === 400 && response.body.title === 'Member Exists')) {
                console.log(response.status, response.body.title);

                const mailchimp = JSON.parse(response.text);

                if (mailchimp.id) {
                    await user.update({ mailchimp_id: mailchimp.id });
                } else {
                    console.log(mailchimp.detail);
                }
                
            } else {
                console.log(response.status, response.body.title);
            }    

        });

        res.status(OK).send({
            success: true,
            message: 'User approved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.updatePassword = async (req, res, next) => {

    try {

        const { old_password, new_password } = req.body;

        if (!bcrypt.compareSync(old_password, req.user.password)) {
            return res.status(UNAUTHENTICATED).send({
                error: true,
                message: 'Password is incorrect!'
            });
        }

        const newPwd = bcrypt.hashSync(new_password, 10);
        const updated = await models.User.update(
            {
                password: newPwd
            },
            {
                where: {
                    user_id: req.user.user_id
                }
            }
        );
                
        if (!updated[0]) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'Password updation is failed!'
            });
        }
        
        res.status(OK).send({
            success: true,
            message: 'Password updated successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.getUser = async (req, res, next) => {

    try {

        const user = await models.User.findOne({
            where: {
                user_id: req.params.user_id
            },
            include: [
                {
                    model: models.user_type
                },
                {
                    model: models.user_invite,
                    as: 'invitations_received',
                    include: {
                        model: models.circle
                    }
                },
                {
                    model: models.user_invite,
                    as: 'invitations_sent',
                    include: {
                        model: models.circle
                    }
                },
                {
                    model: models.user_circle,
                    include: {
                        model: models.circle
                    }
                },
                {
                    model: models.user_industry
                }
            ]
        });

        if (!user) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User does not exist!'
            });
        }
        res.status(OK).send({
            success: true,
            message: 'User fetched successfully!',
            user
        });

    } catch (err) {
        next(err);
    }
}

exports.deleteUser = async (req, res, next) => {

    try {

        const deletedUser = await models.User.destroy({
            where: {
                user_id: req.params.user_id
            }
        });
            
        if (!deletedUser) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'User deletion is failed!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'User deleted successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.modifyUser = async (req, res, next) => {

    try {

        const { first_name, last_name, email, password, headline, summary, location, specialties, linkedin_profile_url, twitter, company, business_phone, mobile_phone, investments_per_year, investment_amount_per_deal, skills, skill_QA, industry_QA } = req.body;

        const user = await models.User.findOne({
            where: {
                user_id: req.params.user_id
            }
        });

        if (!user) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User not found!'
            });
        }
    

        const profile = { ...JSON.parse(user.profile) };
        
        const updateParams = {};

        if (headline)
            profile.headline = headline;
        if (summary)
            profile.summary = summary;
        if (location)
            profile.location = location;
        if (specialties)
            profile.specialties = specialties;
        if (linkedin_profile_url)
            profile.linkedin_profile_url = linkedin_profile_url;
        if (twitter)
            profile.twitter = twitter;
        if (company)
            profile.company = company;
        if (business_phone)
            profile.business_phone = business_phone;
        if (mobile_phone)
            profile.mobile_phone = mobile_phone;
        if (investments_per_year)
            profile.investments_per_year = investments_per_year;
        if (investment_amount_per_deal)
            profile.investment_amount_per_deal = investment_amount_per_deal;
        if (skills && skills.length > 0)
            profile.skills = skills;
        if (skill_QA !== undefined)
            profile.skill_QA = skill_QA;
        if (industry_QA !== undefined)
            profile.industry_QA = industry_QA;

        console.log(profile, JSON.stringify(profile));

        if (first_name)
            updateParams.first_name = first_name;
        if (last_name)
            updateParams.last_name = last_name;
        if (email)
            updateParams.email = email;
        if (password)
            updateParams.password = bcrypt.hashSync(password, 10);
        if (Object.entries(profile).length > 0 && profile.constructor === Object)
            updateParams.profile = JSON.stringify(profile);

        const modified = await models.User.update(
            updateParams,
            {
                where: {
                    user_id: req.params.user_id
                }
            }
        );

        if (!modified) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'User is failed to modify!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'User record modified successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.socialUserInfo = async (req, res, next) => {

    try {

        if (socialUserData && socialUserToken) {

            const socialUser = await models.User.findOne({
                where: {
                    user_id: socialUserData.user_id,
                },
                include: [
                    {
                        model: models.user_type
                    },
                    {
                        model: models.user_invite,
                        as: 'invitations_received',
                        include: {
                            model: models.circle
                        },
                    },
                    {
                        model: models.user_invite,
                        as: 'invitations_sent',
                        include: {
                            model: models.circle
                        },
                    },
                    {
                        model: models.user_circle,
                        include: {
                            model: models.circle
                        }
                    },
                    {
                        model: models.user_industry
                    }
                ]
            });

            if (!socialUser) {
                res.status(NOT_FOUND).send({
                    error: true,
                    message: 'User details are failed to fetch!'
                });
            }

            return res.status(OK).send({
                socialUserToken,
                socialUser,
                success: true,
                message: 'User details fetched successfully!'
            });
            
        }

        res.status(NOT_FOUND).send({
            error: true,
            message: 'User details are failed to fetch!'
        });
        
    } catch (err) {
        next(err);
    }
}

exports.userCircles = async (req, res, next) => {

    try {

        const { user_id } = req.params;

        const circles = await models.user_circle.findAll({
            where: {
                user_id
            },
            include: [
                {
                    model: models.circle
                }
            ]
        });

        if (!circles) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User circles are failed to retrieve!'
            })
        }

        if (circles.length === 0) {
            return res.status(OK).send({
                success: true,
                circles,
                message: 'No user circles are available!'
            })
        }

        res.status(OK).send({
            success: true,
            circles,
            message: 'User circles retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.userDeals = async (req, res, next) => {

    try {

        const { user_id } = req.params;
        const { all, open, closed, interest_level, search_type, search_value } = req.query;

        let condition = {};
        let interest_condition = {};
        let contains;
        let interest;
        let extra;

        condition.submit_by_user_id = user_id;
        condition.deleted = false;

        interest_condition.where = { user_id };
        interest_condition.required = false;

        if (!interest_level) {

            interest = await models.interest_level.findOne({
                where: {
                    name: 'Pass'
                }
            });

            interest_condition.where = { 
                ...interest_condition.where, 
                interest_level_id: { [Op.ne]: interest.interest_level_id } 
            };
            // interest_condition.required = true;

            console.log('interest condition', interest_condition);
        }

        if (open === "true") {
            condition = {
                ...condition,
                [Op.and]: [
                    { expected_close_date: { [Op.gte]: Date.now() } },
                    { actual_close_date: { [Op.eq]: null } }
                ]
            }
        }

        if (closed === "true") {
            condition = {
                ...condition,
                [Op.and]: [
                    { submit_by_user_id: user_id },
                    {
                        [Op.or]: [
                            { 
                                [Op.and]: [
                                    { expected_close_date: { [Op.lte]: Date.now() } },
                                    { actual_close_date: { [Op.eq]: null } }
                                ]
                            },
                            { actual_close_date: { [Op.lte]: Date.now() } }
                        ]
                    }
                ]
            }
        }

        if (search_value) {

            contains = { [Op.like]: `%${search_value}%` };

            if (search_type === "all") {

                condition[Op.or] = [
                    { company_name: contains },
                    { sponsor_name: contains },
                    { summary: contains },
                    { short_description: contains },
                    { location: contains },
                    { stage: contains },
                    { deal_contact_name: contains },
                    { deal_contact_email: contains }
                ]
            }

            else {

                if (search_type === "company") {
                    condition.company_name = contains;
                }
                else if  (search_type === "sponsor") {
                    condition.sponsor_name = contains;
                }
                else {
                    condition.short_description = contains;
                }
            }
        }

        let deals = await myDeals(condition, interest_condition, user_id);

        if (all === "true") {

            condition.submit_by_user_id = { [Op.ne]: user_id };
            interest_condition.required = true;
            
            extra = await myDeals(condition, interest_condition, user_id);
            deals = [...deals, ...extra];
        }

        if (!deals) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deals are failed to retrieve!'
            })
        }

        if (deals.length === 0) {
            return res.status(OK).send({
                error: true,
                message: 'No deals are available!',
                deals
            })
        }

        res.status(OK).send({
            success: true,
            message: 'Deals are retrieved successfully!',
            deals: modifyDealRecords(deals, req.user)
        });

    } catch (err) {
        next(err);
    }    
}

exports.userIndustries = async (req, res, next) => {

    try {

        const { user_id } = req.params;

        const industries = await models.user_industry.findAll({
            where: {
                user_id
            },
            include: [
                {
                    model: models.industry
                }
            ]
        });

        if (!industries) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User industries are failed to retrieve!'
            })
        }

        if (industries.length === 0) {
            return res.status(OK).send({
                success: true,
                industries,
                message: 'No user industries are available!'
            })
        }

        res.status(OK).send({
            success: true,
            industries,
            message: 'User industries retrieved successfully!'
        })

    } catch (err) {
        next(err);
    }
}

exports.userDealCategory = async (req, res, next) => {

    try {

        const { user_id } = req.params;

        const user_deal_category = await models.user_deal_category.findAll({
            where: {
                user_id
            }
        });

        if (!user_deal_category) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User deal category/sub-category is failed to retrieve!'
            })
        }

        if (user_deal_category.length === 0) {
            return res.status(OK).send({
                success: true,
                user_deal_category,
                message: 'No user deal category/sub-categories are available!'
            })
        }

        res.status(OK).send({
            success: true,
            user_deal_category,
            message: 'User deal category/sub-category retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }

    
}

exports.insertUserDealCategory = async (req, res, next) => {

    try {

        let { user_deal_category } = req.body;
        const { user_id } = req.params;
        user_deal_category = JSON.parse(user_deal_category);
        
        let newDealCategory;

        if (user_deal_category.sub_categories.length > 0) {

            user_deal_category.sub_categories.forEach(async subCategory => {
                
                newDealCategory = await models.user_deal_category.findOrCreate({
                    where: {
                        user_id,
                        deal_category_id: user_deal_category.category,
                        deal_sub_category_id: subCategory
                    },
                    defaults: {}
                });

                if (!newDealCategory) {
                    return res.status(EXPECTATION_FAILED).send({
                        error: true,
                        message: 'Deal category/sub-category is failed to insert!'
                    });
                }
            });
        
            res.status(OK).send({
                success: true,
                message: 'Deal category/sub-category added successfully!'
            });

        } else {

            newDealCategory = await models.user_deal_category.findOrCreate({
                where: {
                    user_id,
                    deal_category_id: user_deal_category.category
                },
                defaults: {}
            });
            
            if (!newDealCategory) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Deal category is failed to insert!'
                });
            }

            res.status(OK).send({
                success: true,
                message: 'Deal category added successfully!'
            });
        }

    } catch (err) {
        next(err);
    }
}

exports.removeUserDealCategory = async (req, res, next) => {

    try {

        let { user_deal_category } = req.body;
        const { user_id } = req.params;
        user_deal_category = JSON.parse(user_deal_category);

        if (user_deal_category.sub_categories.length > 0) {
            
            user_deal_category.sub_categories.forEach(async subCategory => {
                
                let deleted = await models.user_deal_category.destroy({
                    where: {
                        user_id,
                        deal_category_id: user_deal_category.category,
                        deal_sub_category_id: subCategory
                    }
                });
                
                if (!deleted) {
                    return res.status(EXPECTATION_FAILED).send({
                        error: true,
                        message: 'Deal category/sub-category deletion is failed!'
                    });
                }
        
            });
        
            res.status(OK).send({
                success: true,
                message: 'Deal category/sub-category removed successfully!'
            });

        } else {

            const deleted = await models.user_deal_category.destroy({
                where: {
                    user_id,
                    deal_category_id: user_deal_category.category
                }
            });
                
            if (!deleted) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Deal category deletion is failed!'
                });
            }
    
            res.status(OK).send({
                success: true,
                message: 'Deal category removed successfully!'
            });
        }

    } catch (err) {
        next(err);
    }
}

exports.userInvitations = async (req, res, next) => {

    try {

        const { user_id } = req.params;
        const { pending, type } = req.query;
        let status;

        let query = `(invite_user_id = ${user_id} OR invited_by_user_id = ${user_id})`;

        if (pending === "true" && type === "sent") {
            query = `invited_by_user_id = ${user_id} AND date_accepted is NULL`;
            status = 'Pending ';
        }
        if (pending === "true" && type === "received") {
            query = `invite_user_id = ${user_id} AND date_accepted is NULL`;
            status = 'Pending ';
        }
        if (pending === "false" && type === "sent") {
            query = `invited_by_user_id = ${user_id} AND date_accepted is NOT NULL`;
            status = 'Accepted ';
        }
        if (pending === "false" && type === "received") {
            query = `invite_user_id = ${user_id} AND date_accepted is NOT NULL`;
            status = 'Joined ';
        }
        if (pending === "true" && !type) {
            query = `(invite_user_id = ${user_id} OR invited_by_user_id = ${user_id}) AND date_accepted is NULL`;
            status = 'Pending ';
        }
        if (pending === "false" && !type) {
            query = `(invite_user_id = ${user_id} OR invited_by_user_id = ${user_id}) AND date_accepted is NOT NULL`;
            status = 'Joined/Accepted ';
        }
        if (type === "sent" && !pending) {
            query = `invited_by_user_id = ${user_id}`;
            status = '';
        }
        if (type === "received" && !pending) {
            query = `invite_user_id = ${user_id}`;
            status = '';
        }

        const invitations = await models.user_invite.findAll({
            where: sequelize.literal(query),
            include: [
                {
                    model: models.circle
                }
            ]
        });

        if (!invitations) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: `${status}Invitations are failed to retrieve!`
            });
        }

        if (invitations.length === 0) {
            return res.status(OK).send({
                success: true,
                invitations,
                message: `No ${status}Invitations are available!`
            });
        }

        res.status(OK).send({
            success: true,
            invitations,
            message: `${status}Invitations retrieved successfully!`
        });

    } catch (err) {
        next(err);
    }

    
}

exports.filteredDeals = async (req, res, next) => {

    try {

        const deals = await models.deal.findAll({
            where: {
                deleted: false,
                submit_by_user_id: req.user.user_id
            },
            include: [
                {
                    model: models.deal_circle
                }
            ]
        });

        if (!deals) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User deals are failed to retrieve!'
            })
        }

        res.status(OK).send({
            success: true,
            message: 'User deals filtered successfully!',
            deals: modifyDealRecords(deals, req.user)
        });

    } catch (err) {
        next(err);
    }
}

exports.insertIndustry = async (req, res, next) => {

    try {

        const { user_id } = req.params;
        const { industries, relationship_type } = req.body;

        if (validationResult(req).errors.length) {
            
            return res.status(UNPROCESSABLE_ENTITY).send({
                errors: validationResult(req).errors,
                message: 'Invalid Value'
            });
        }

        await models.user_industry.destroy({
            where: {
                user_id,
                relationship_type
            }
        });
    
        industries.forEach(async industry => {

            const user_industry = await models.user_industry.create({
                user_id,
                industry_id: +industry,
                relationship_type,
                date_added: Date.now()
            });

            if (!user_industry) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Industry is failed to add in user account!'
                });
            }
        });

        res.status(OK).send({
            success: true,
            message: 'Industry added to the user account successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.userProfileTypes = async (req, res, next) => {

    try {

        const user_profile_types = await models.user_profile_type.findAll({});

        if (!user_profile_types) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User profile types are failed to retrieve!'
            });
        }

        if (user_profile_types.length === 0) {
            return res.status(OK).send({
                success: true,
                user_profile_types,
                message: 'No user profile types are available!'
            });
        }

        res.status(OK).send({
            success: true,
            user_profile_types,
            message: 'User profile types retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealsSummary = async (req, res, next) => {

    try {

        const { active } = req.query;
        const { user_id } = req.params;

        let condition = {
            deleted: false
        };

        const summary = {
            deals: 0,
            favorite: 0,
            viewed: 0,
            non_viewed: 0,
            new: 0,
            closing_soon: 0
        }

        const current_date = moment()._d;
        const prev_date = moment().subtract(7, 'day')._d;
        const next_date = moment().add(7, 'day')._d;

        // check for active query parameter
        if (active !== undefined) {
            
            // condition for active=true
            if (active === "true") {

                condition = {
                    ...condition,
                    [Op.or]: [
                        { expected_close_date: { [Op.gt]: current_date } },
                        { actual_close_date: { [Op.gt]: current_date } }
                    ]
                }
            }

            // condition for active=false
            if (active === "false") {

                condition = {
                    ...condition,
                    [Op.and]: [
                        { expected_close_date: { [Op.lt]: current_date } },
                        { actual_close_date: { [Op.lt]: current_date } }
                    ]
                }
            }
        }

        // fetching user deals summary
        const deals = await models.deal.findAll({
            where: {
                ...condition,
                submit_by_user_id: user_id
            },  
            include: [
                {
                    model: models.deal_circle
                },
                {
                    model: models.user_deal_interest
                }
            ]
        });
    
        // total deals
        summary.deals = deals.length;
    
        deals.forEach(deal => {
    
            // check for non-viewed deals
            if (!deal.user_deal_interests.length) {
                summary.non_viewed = summary.non_viewed + 1
            }
    
            // check for viewed deals
            if (deal.user_deal_interests.length) {
                summary.viewed = summary.viewed + 1;
    
                // // check for favorite deals
                if (deal.user_deal_interests[0].favorite) {
                    summary.favorite = summary.favorite + 1;
                }
            }
    
            // check for new deals (created within last 7 days)
            if (moment(deal.created_at).isSameOrAfter(prev_date)) {
                summary.new = summary.new + 1;
            }
    
            // check for closed-soon deals (expected close within 7 days)
            if (moment(deal.expected_close_date).isSameOrAfter(current_date) && moment(deal.expected_close_date).isSameOrBefore(next_date)) {
                summary.closing_soon = summary.closing_soon + 1;
            }
        })
    
        res.status(OK).send({
            success: true,
            message: 'Deals summary is retrieved successfully!',
            summary
        });

    } catch (err) {
        next(err);
    }
}

exports.circlesSummary = async (req, res, next) => {

    try {

        const { user_id } = req.params;

        const summary = {
            circles: 0,
            people: 0,
            invited: 0,
            accepted: 0,
            pending: 0
        }

        // fetching user circles
        const user_circles = await models.user_circle.findAll({
            where: {
                user_id
            }
        });

        // generating user circles' id array
        const circles = user_circles.map(user_circle => user_circle.circle_id);

        // fetching people count in user circles
        const people = await models.user_circle.count({
            where: {
                user_id: { [Op.ne]: user_id },
                circle_id: { [Op.in]: circles }
            }
        });

        // fetching user circle invites
        const user_invites = await models.user_invite.findAll({
            where: {
                invited_by_user_id: user_id
            }
        });

        summary.circles = circles.length;
        summary.people = people;
        summary.invited = user_invites.length;

        user_invites.forEach(user_invite => {
            
            // condition for pending/accepted circleinvites
            if (!user_invite.date_accepted) {
                summary.pending = summary.pending + 1;
            } else {
                summary.accepted = summary.accepted + 1;
            }
        });

        res.status(OK).send({
            success: true,
            message: 'Circles summary is retrieved successfully!',
            summary
        });

    } catch (err) {
        next(err);
    }
}

exports.resetPasswordRequest = async (req, res, next) => {

    try {

        const { email } = req.params;

        const user = await models.User.findOne({
            where: {
                email
            }
        });

        if (!user) {

            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Please check your email'
            });
        }

        const token = await jwt.sign({ user }, secretKey, { expiresIn: '1h', algorithm: 'HS256' });

        const data = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            url: `${baseAddress + '/reset_password?token=' + token}`,
            subject: `Reset Account Password`
        }

        const mailer = Mailer.getInstance();
        mailer.initializeTemplate(resetPasswordTemplate, data);
        await mailer.send();

        res.status(OK).send({
            success: true,
            message: 'Reset password email is sent successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.resetPassword = async (req, res, next) => {

    try {

        const { token, password } = req.body;

        const decoded = await jwt.verify(token, secretKey);
        const password_hashed = bcrypt.hashSync(password, 10);

        const updated = await models.User.update({
            password: password_hashed
        },
        {
            where: {
                user_id: decoded.user.user_id
            }
        });
                  
        if (!updated[0]) {

            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'Password resetting is failed!'
            });
        }
        
        res.status(OK).send({
            success: true,
            message: 'Password is reset successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.insertUserDealActivity = async (req, res, next) => {

    try {

        const { user_id, deal_id } = req.params;
        const { activity_type, activity_date, notes, deal_document_id } = req.body;

        const user_deal_activity = await models.user_deal_activity.create({
            user_id,
            deal_id,
            activity_type,
            activity_date,
            notes,
            deal_document_id
        });

        if (!user_deal_activity) {

            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'User deal activity is failed to record!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'User deal activity recorded successfully!'
        })

    } catch (err) {
        next(err);
    }
}

exports.getUserDealActivity = async (req, res, next) => {

    try {

        const { user_id, deal_id } = req.params;

        const user_deal_activity = await models.user_deal_activity.findAll({
            where: {
                user_id,
                deal_id
            },
            include: [
                {
                    model: models.user_activity_type
                },
                {
                    model: models.deal_document
                }
            ],
            order: [
                ['activity_date', 'DESC']
            ]
        });

        if (!user_deal_activity) {

            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User deal activity is failed to retrieve!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'User deal activity is retrieved successfully!',
            user_deal_activity
        })

    } catch (err) {
        next(err);
    }
}