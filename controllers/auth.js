const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { secretKey, baseAddress, successfulSignupTemplate } = require('../config');
const Mailer = require('../services/Mailer');
const models = require('../models');
const statusCodes = require('../config/statusCodes');

const { CONFLICT, NOT_FOUND, OK, UNAUTHENTICATED, EXPECTATION_FAILED } = statusCodes; 

exports.register = async (req, res, next) => {

    try {

        const { first_name, last_name, email, password, shortcode } = req.body;

        const existingUser = await models.User.findOne({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(CONFLICT).send({
                error: true,
                message: 'Email already exists!'
            })
        }
    
        const role = await models.user_type.findOne({
            where: {
                role: 'User'
            }
        });
                
        const newUser = await models.User.create({
            first_name,
            last_name,
            email,
            password: bcrypt.hashSync(password, 10),
            user_type_id: role.user_type_id
        });

        if (!newUser) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'User failed to register!'
            })
        }

        const data = {
            email,
            username: first_name + " " + last_name,
            subject: "Successful Registration With Alternate Investment Plan"
        };

        const mailer = Mailer.getInstance();
        mailer.initializeTemplate(successfulSignupTemplate, data);
        mailer.send();
    
        if (shortcode) {

            // Accepting circle(s) invitation
            await models.user_invite.update(
                {   
                    invite_user_id: newUser.user_id,
                    date_accepted: Date.now()
                },
                {
                    where: {
                        email
                    }
                }
            );

            const user_invites = await models.user_invite.findAll({ where: { invite_user_id: newUser.user_id } });

            // Adding circle(s) to user's circles
            user_invites.forEach(async user_invite => {

                await models.user_circle.create({
                    user_id: newUser.user_id,
                    circle_id: user_invite.circle_id,
                    invited_by_user_id: user_invite.invited_by_user_id,
                    date_added: Date.now()
                });
            });
        }
    
        res.status(OK).send({
            success: true,
            message: 'User registered successfully. Login now!'
        });

    } catch (err) {
        next(err);
    }
}

exports.login = async (req, res, next) => {

    try {

        const { email, password } = req.body;
        let user;

        const existingUser = await models.User.findOne({
            where: {
                email
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

        if (!existingUser) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'User with this email address does not exist!'
            });
        }

        if (existingUser.provider_name) {
            return res.status(CONFLICT).send({
                error: true,
                message: 'Unable to log in! It appears that you have registered with LinkedIn. Please re-try using the Sign in with LinkedIn button'
            });
        }

        user = existingUser;    
        const decoded = await bcrypt.compare(password, user.password);

        if (!decoded) {
            return res.status(UNAUTHENTICATED).send({
                error: true,
                message: 'Password is incorrect!'
            });  
        }
        
        jwt.sign({ id: user.user_id, email: user.email }, secretKey, { expiresIn: '30 days', algorithm: 'HS256' }, (err, token) => {
            
            if (err) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: err.message
                });
            }
            
            res.status(OK).send({
                success: true,
                token,
                user,
                message: 'User authenticated successfully!'
            });
        });

    } catch (err) {
        next(err);
    }
}

exports.linkedin = (req, res, next) => {

    if (!req.user) {
        return res.status(NOT_FOUND).send({
            error: true,
            message: 'User not found!'
        });
    }

    jwt.sign({ id: req.user.user_id, email: req.user.email }, secretKey, { expiresIn: '30 days', algorithm: 'HS256' }, (err, token) => {
        
        if (err) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: err.message
            });
        }

        global.socialUserToken = token;
        global.socialUserData = req.user;

        res.redirect(`${baseAddress + '/home?mode=social'}`);
    });
}