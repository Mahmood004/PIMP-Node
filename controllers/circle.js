const md5 = require('crypto-md5');
const sequelize = require('sequelize');
const Mailer = require('../services/Mailer');
const models = require('../models');
const helpers = require('../services/helpers');
const statusCodes = require('../config/statusCodes');

const { inviteUserTemplate, inviteNonUserTemplate, baseAddress } = require('../config');
const { modifyDealRecords, isSiteAdminOrCircleCreatorOrCircleAdmin } = helpers;
const { OK, NOT_FOUND, EXPECTATION_FAILED, CONFLICT, FORBIDDEN } = statusCodes;

const Op = sequelize.Op;

exports.inviteUserToCircle = async (req, res, next) => {

    try {

        const { invite_user_id, first_name, last_name, email } = req.body;
        const { circle_id } = req.params;

        const user_circle = await models.user_circle.findOne({
            where: {
                user_id: req.user.user_id,
                circle_id
            },
            include: {
                model: models.circle
            }

        });

        if (!user_circle) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Requesting user does not belong to the desired circle!'
            });
        }

        if (!invite_user_id) {

            const result = await models.user_invite.findOrCreate({
                where: {
                    email,
                    circle_id
                },
                defaults: {
                    invited_by_user_id: req.user.user_id,
                    first_name,
                    last_name,
                    date_added: Date.now(),
                    shortcode: md5(`${req.user.user_id + new Date().toISOString()}`, 'hex').slice(-8)
                }
                
            });
                
            if (!result[1] && result[0].date_accepted) {
                return res.status(CONFLICT).send({
                    error: true,
                    message: 'Requestee already belongs to this circle!'
                });
            }

            if (!result[1] && !result[0].date_accepted) {
                return res.status(CONFLICT).send({
                    error: true,
                    message: 'Requestee has already been invited for this circle!'
                });
            }
    
            if (!result[0]) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Invitation for a circle failed to place!'
                });
            }
    
            let data = {
                first_name,
                last_name,
                shortcode: result[0].shortcode,
                email,
                baseAddress,
                subject: `You have been invited for ${user_circle.circle.name} circle`
            }

            const mailer = Mailer.getInstance();
            mailer.initializeTemplate(inviteNonUserTemplate, data);
            await mailer.send();
            
            res.status(OK).send({
                success: true,
                message: 'Invitation for a circle has been placed successfully!'
            });

        } else {

            const result = await models.user_invite.findOrCreate({
                where: {
                    invite_user_id,
                    circle_id
                },
                defaults: {
                    invited_by_user_id: req.user.user_id,
                    date_added: Date.now(),
                    shortcode: md5(`${req.user.user_id + new Date().toISOString()}`, 'hex').slice(-8)
                }
                
            });
                
            if (!result[1] && result[0].date_accepted) {
                return res.status(CONFLICT).send({
                    error: true,
                    message: 'Requestee already belongs to this circle!'
                });
            }

            if (!result[1] && !result[0].date_accepted) {
                return res.status(CONFLICT).send({
                    error: true,
                    message: 'Requestee has already been invited for this circle!'
                });
            }

            if (!result[0]) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Invitation for a circle failed to place!'
                });
            }
    
            const user = await models.User.findOne({ where: { user_id: invite_user_id }});

            if (!user) {
                return res.status(NOT_FOUND).send({
                    error: true,
                    message: 'Requestee not found!'
                });
            }
    
            let data = {
                first_name: user.first_name,
                last_name: user.last_name,
                shortcode: result[0].shortcode,
                email: user.email,
                subject: `You have been invited for ${user_circle.circle.name} circle`
            }
    
            const mailer = Mailer.getInstance();
            mailer.initializeTemplate(inviteUserTemplate, data);
            await mailer.send();

            res.status(OK).send({
                success: true,
                message: 'Invitation for a circle has been placed successfully!'
            });   
        } 

    } catch (err) {
        next(err);
    }
}

exports.circles = async (req, res, next) => {

    try {

        let query = {};

        if (req.user.user_type.role !== 'Admin')
            query.private = 0;

        const circles = await models.circle.findAll({
            where: query,
        });

        if (!circles) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Circles failed to retrieve!' 
            });
        }

        if (circles.length === 0) {
            return res.status(OK).send({
                success: true,
                message: 'No circles are available!',
                circles 
            });
        }
        
        res.status(OK).send({
            success: true,
            message: 'Circles retrieved successfully!',
            circles
        });

    } catch (err) {
        next(err);
    }
}

exports.circleMembers = async (req, res, next) => {

    try {

        const { circle_id } = req.params;

        const user_circle = await models.user_circle.findOne({
            where: {
                circle_id,
                user_id: req.user.user_id
            }
        });

        if (req.user.user_type.role === 'Admin' || user_circle) {

            const members = await models.user_circle.findAll({
                where: {
                    circle_id,
                    user_id: {
                        [Op.ne]: req.user.user_id
                    }
                },
                include: [
                    {
                        model: models.User,
                        where: {
                            approved: true
                        }
                    }
                ]
            });

            if (!members) {
                return res.status(NOT_FOUND).send({
                    error: true,
                    message: 'Circle members failed to retrieve!'
                })
            }

            if (members.length === 0) {
                return res.status(OK).send({
                    success: true,
                    message: 'No members are available in this circle!',
                    members,
                })
            }

            res.status(OK).send({
                success: true,
                message: 'Circle members retrieved successfully!',
                members
            });

        }

        if (!user_circle) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User does not belong to this circle!'
            });
        }

    } catch (err) {
        next(err);
    }
}

exports.acceptInvitationById = async (req, res, next) => {

    try {

        const { invite_id } = req.params;

        const invitation = await models.user_invite.findOne({
            where: sequelize.literal(`user_invite_id = ${invite_id} AND invite_user_id = ${req.user.user_id} AND date_accepted is NULL AND circle_id is NOT NULL`)
        });

        if (!invitation) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Invitation does not exist!'
            })
        }

        await invitation.update({
            date_accepted: Date.now()
        });

        res.status(OK).send({
            success: true,
            message: 'Invitation is accepted successfully!',
            user_circle
        });

    } catch (err) {
        next(err);
    }
}

exports.approveInvitation = async (req, res, next) => {

    try {

        const { invite_id } = req.params;

        const invitation = await models.user_invite.findOne({
            where: {
                user_invite_id: invite_id
            }
        });

        if (!invitation) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Invitation does not exist!'
            })
        }

        const found = await isSiteAdminOrCircleCreatorOrCircleAdmin(req.user, invitation.circle_id)
        
        if (!found) {

            return res.status(FORBIDDEN).send({
                error: true,
                message: 'Requesting user is not authorized!'
            });
        }

        await invitation.update({
            approved: true,
            date_approved: Date.now(),
            date_completed: Date.now(),
            approved_by: req.user.user_id
        });

        const user_circle = await models.user_circle.findOrCreate({
            where: {
                user_id: invitation.invite_user_id,
                circle_id: invitation.circle_id,
            },
            defaults: {
                date_added: Date.now(),
                invited_by_user_id: invitation.invited_by_user_id
            }
        });

        if (!user_circle[0]) {
            return res.status(CONFLICT).send({
                error: true,
                message: 'Invited circle already exists in user\'s circles!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'Circle is approved & added to user\'s circles successfully!'
        })

    } catch (err) {
        next(err);
    }

}

exports.dealsPerCircle = async (req, res, next) => {

    try {

        const { circle_id } = req.params;
        const deals = await models.deal_circle.findAll({
            where: {
                circle_id
            },
            include: [
                {
                    model: models.deal,
                    where: {
                        deleted: false
                    }
                }
            ]
        });

        if (!deals) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deals in desired circle failed to retrieve!'
            })
        }

        if (deals.length === 0) {
            return res.status(OK).send({
                success: true,
                message: 'No deals are available in desired circle!',
                deals
            });
        }

        let result = deals.map(deal => {
            return { ...deal.get({ plain: true }), deal: modifyDealRecords(deal.deal, req.user) };
        });

        res.status(OK).send({
            success: true,
            message: 'Deals in desired circle retrieved successfully!',
            deals: result
        })

    } catch (err) {
        next(err);
    }
}

exports.insertCircle = async (req, res, next) => {

    try {

        const { name } = req.body;
        const shortcode = md5(`${req.user.user_id + new Date().toISOString()}`, 'hex').slice(-10);

        const circle = await models.circle.create({
            name,
            shortcode,
            created_by_user_id: req.user.user_id,
            active: true,
            private: true
        });

        if (!circle) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'Circle is failed to insert!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'Circle is inserted successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.assignCircleAdmin = async (req, res, next) => {

    try {

        const { circle_id } = req.params;
        const { user_id } = req.body;

        const found = await isSiteAdminOrCircleCreatorOrCircleAdmin(req.user, circle_id)
        
        if (!found) {

            return res.status(FORBIDDEN).send({
                error: true,
                message: 'Requesting user is not authorized!'
            });
        }

        const [, created] = await models.circle_admin.findOrCreate({
            where: {
                circle_id,
                user_id
            },
            defaults: {
                added_by_user_id: req.user.user_id
            }
        });

        if (!created) {
            return res.status(CONFLICT).send({
                error: true,
                message: 'User is already assigned as circle admin!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'User is assigned as circle admin successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.removeCircleAdmin = async (req, res, next) => {

    try {

        const { circle_id, user_id } = req.params;

        const found = await isSiteAdminOrCircleCreatorOrCircleAdmin(req.user, circle_id)
        
        if (!found) {

            return res.status(FORBIDDEN).send({
                error: true,
                message: 'Requesting user is not authorized!'
            });
        }

        await models.circle_admin.destroy({
            where: {
                circle_id,
                user_id
            }
        });

        res.status(OK).send({
            success: true,
            message: 'User is unassigned as circle admin successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.circleInvites = async (req, res, next) => {

    try {

        const { circle_id } = req.params;
        const { approved } = req.query;
        
        const condition = {
            circle_id
        };

        const found = await isSiteAdminOrCircleCreatorOrCircleAdmin(req.user, circle_id)
        
        if (!found) {

            return res.status(FORBIDDEN).send({
                error: true,
                message: 'Requesting user is not authorized!'
            });
        }

        if (approved) {
            
            condition.date_added = {
                [Op.ne]: null
            }

            if (approved === "true")
                condition.approved = true;

            if (approved === "false")
                condition.approved = false;
        }

        const invites = await models.user_invite.findAll({
            where: condition
        });

        if (!invites) {

            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Circle invite(s) are failed to retrieve!'
            });
        }

        if (invites.length === 0) {

            return res.status(OK).send({
                success: true,
                message: 'No invite(s) are available for this circle'
            })
        }

        res.status(OK).send({
            success: true,
            invites,
            message: 'Circle invite(s) are retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}