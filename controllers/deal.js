const md5 = require('crypto-md5');
const aws = require('aws-sdk');
const fs = require('fs');
const sequelize = require('sequelize');
const moment = require('moment');
const { google } = require('googleapis');
const models = require('../models');
const Mailer = require('../services/Mailer');
const helpers = require('../services/helpers');
const statusCodes = require('../config/statusCodes');

const { secretAccessKey, accessKeyId, region, bucket, dealsGmailAccount, dealViaMessageTemplate } = require('../config');
const { modifyDealRecords, dealFinder } = helpers;
const { OK, NOT_FOUND, EXPECTATION_FAILED, CONFLICT, FORBIDDEN } = statusCodes;

aws.config.update({
    secretAccessKey,
    accessKeyId,
    region
});

const s3bucket = new aws.S3();
const Op = sequelize.Op;

exports.dealCategoryAndTypeBySubCategory = async (req, res, next) => {

    try {

        const { deal_sub_category_id } = req.params;

        const details = await models.deal_sub_category.findOne({
            where: {
                deal_sub_category_id
            },
            include: {
                model: models.deal_category
            }
        });

        return res.status(OK).send({
            success: true,
            details,
            message: 'Deal category and type retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealStatuses = async (req, res, next) => {

    try {

        const statuses = await models.deal_status.findAll({
            where: {
                active: true
            }
        });
            
        if (!statuses) {
    
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal status list failed to retrieve!'
            });
        }
    
        if (statuses.length === 0) {
            return res.status(OK).send({
                success: true,
                statuses,
                message: 'No deal statuses are available!'
            });
        }
    
        res.status(OK).send({
            success: true,
            statuses,
            message: 'Deal status list retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealTypes = async (req, res, next) => {

    try {

        const types = await models.deal_type.findAll({
            where: {
                active: true
            },
            include: [
                {
                    model: models.deal_category,
                    include: [
                        {
                            model: models.deal_sub_category
                        }
                    ]
                }
            ]
        });

        
        if (!types) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal type list failed to retrieve!'
            });
        }

        if (types.length === 0) {
            return res.status(OK).send({
                success: true,
                types,
                message: 'No deal types are available!'
            });
        }

        res.status(OK).send({
            success: true,
            types,
            message: 'Deal type list retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealActivities = async (req, res, next) => {

    try {

        const activities = await models.user_activity_type.findAll({
            where: {
                active: true
            }
        });
            
        if (!activities) {
    
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal activity list failed to retrieve!'
            });
        }
    
        if (activities.length === 0) {
            return res.status(OK).send({
                success: true,
                activities,
                message: 'No deal activities are available!'
            });
        }
    
        res.status(OK).send({
            success: true,
            activities,
            message: 'Deal activity list retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealInstruments = async (req, res, next) => {

    try {

        const instruments = await models.deal_instrument.findAll({
            where: {
                active: true
            }
        });
            
        if (!instruments) {
    
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal instrument list failed to retrieve!'
            });
        }
    
        if (instruments.length === 0) {
            return res.status(OK).send({
                success: true,
                instruments,
                message: 'No deal instruments are available!'
            });
        }
    
        res.status(OK).send({
            success: true,
            instruments,
            message: 'Deal instrument list retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealCategories = async (req, res, next) => {

    try {

        const categories = await models.deal_category.findAll({
            where: {
                active: true
            },
            include: [
                {
                    model: models.deal_type 
                }
            ]
        });

        
        if (!categories) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal category list failed to retrieve!'
            });
        }

        if (categories.length === 0) {
            return res.status(OK).send({
                success: true,
                categories,
                message: 'No deal categories are available!'
            });
        }

        res.status(OK).send({
            success: true,
            categories,
            message: 'Deal category list retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealCategoriesByTpye = async (req, res, next) => {

    try {

        const { type_id } = req.params;
        const categories = await models.deal_category.findAll({
            where: {
                active: true,
                deal_type_id: type_id
            }
        });

        
        if (!categories) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal category list failed to retrieve!'
            });
        }

        if (categories.length === 0) {
            return res.status(OK).send({
                success: true,
                categories,
                message: 'No deal sub-categories are available!'
            });
        }

        res.status(OK).send({
            success: true,
            categories,
            message: 'Deal sub-category list retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealSubCategories = async (req, res, next) => {

    try {

        const sub_categories = await models.deal_sub_category.findAll({
            where: {
                active: true
            },
            include: [
                {
                    model: models.deal_category,
                    include: [
                        {
                            model: models.deal_type
                        }
                    ]
                }
            ]
        });
        
        if (!sub_categories) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal sub-category list failed to retrieve!'
            });
        }

        if (sub_categories.length === 0) {
            return res.status(OK).send({
                success: true,
                sub_categories,
                message: 'No deal sub-categories are available!'
            });
        }

        res.status(OK).send({
            success: true,
            sub_categories,
            message: 'Deal sub-category list retrieved successfully!'
        }); 

    } catch (err) {
        next(err);
    }
}

exports.dealSubCategoriesByCategory = async (req, res, next) => {

    try {

        const { category_id } = req.params;
        const sub_categories = await models.deal_sub_category.findAll({
            where: {
                active: true,
                deal_category_id: category_id
            }
        });

        if (!sub_categories) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal sub-category list failed to retrieve!'
            });
        }

        if (sub_categories.length === 0) {
            return res.status(OK).send({
                success: true,
                sub_categories,
                message: 'No deal sub-categories are available!'
            });
        }

        res.status(OK).send({
            success: true,
            sub_categories,
            message: 'Deal sub-category list retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.insertDeal = async (req, res, next) => {

    try {

        const { deal_circles, message, ...dealAttributes } = req.body;
        const { user_id } = req.user;

        const shortcode = md5(`${user_id + new Date().toISOString()}`, 'hex').slice(-8);

        const newDeal = await models.deal.create({
            ...dealAttributes,
            shortcode,
            submit_by_user_id: user_id,
            submit_date: Date.now(),
        });

        await models.user_deal_interest.create({
            user_id,
            deal_id: newDeal.deal_id
        })

        if (deal_circles && deal_circles.length > 0) {

            deal_circles.forEach(async circle => {

                await models.deal_circle.create({
                    deal_id: newDeal.deal_id,
                    circle_id: circle,
                    added_by_user_id: user_id,
                    date_added: Date.now()
                });
            });

        }

        if (message) {

            const { headers, parts } = message.payload;

            const email = headers.find(header => header.name === "From").value;
            const subject = headers.find(header => header.name === "Subject").value;

            const data = {
                username: email,
                email: email,
                subject: `Deal Created From Your Message With Subject - ${subject}`
            }

            const gmail = google.gmail({version: 'v1', auth: global.oauth2client});

            parts.forEach(async part => {

                if (part.filename) {

                    const attachId = part.body.attachmentId;
                    const attachment = await gmail.users.messages.attachments.get({
                        id: attachId,
                        messageId: message.id,
                        userId: dealsGmailAccount

                    });

                    const newFile = await models.deal_document.create({
                        deal_id: newDeal.deal_id,
                        file_name: part.filename,
                        file_type: part.mimeType,
                        submit_date: Date.now(),
                        submit_by_user_id: user_id,
                        file_size: attachment.data.size
                    });

                    console.log('Body', attachment.data.data);
                    var params = {
                        Bucket: bucket,
                        Key: `documents/${newFile.deal_id}/${newFile.deal_document_id}-${part.filename}`,
                        Body: attachment.data.data
                    };

                    s3bucket.upload(params, async (err, data) => {
        
                        if (err) {
                            res.status(EXPECTATION_FAILED).send(err);
                        } else {
                            res.status(OK).end();
                        }

                        await models.deal_document.update(
                            { storage_location: data.Location },
                            { where: { deal_document_id: newFile.deal_document_id } }
                        );

                    });
                }
            });

            const labels = await gmail.users.labels.list({
                userId: dealsGmailAccount
            });

            const labelId = labels.data.labels.find(label => label.name === "Processed").id;

            await gmail.users.messages.modify({
                userId: dealsGmailAccount,
                id: message.id,
                resource: {
                    addLabelIds: [
                        labelId
                    ],
                    removeLabelIds: [
                        "INBOX"
                    ]
                }
            });

            const mailer = Mailer.getInstance();
            mailer.initializeTemplate(dealViaMessageTemplate, data);
            mailer.send();
        }

        res.status(OK).send({
            success: true,
            deal_id: newDeal.deal_id,
            message: 'Deal inserted successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.insertDealWithoutAuth = async (req, res, next) => {

    try {

        const { deal } = req.body;

        const shortcode = md5(`${deal.submit_by_user_id + new Date().toISOString()}`, 'hex').slice(-8);

        await models.deal.create({
            ...deal,
            shortcode,
            submit_date: Date.now(),
        });

        res.status(OK).send({
            success: true,
            message: 'Deal inserted successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.approveDeal = async (req, res, next) => {

    try {

        const { deal_id } = req.params;

        const approved = await models.deal.update(
            {
                approved: 1,
                approved_by_user_id: req.user.user_id,
                approved_date: Date.now(),
            },
            {
                where: {
                    deal_id
                }
            }
        );

        if (!approved[0]) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'Deal is unable to approve!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'Deal approved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.deals = async (req, res, next) => {

    try {

        const { approved, date, frequency, amount, circle, type, category, sub_category } = req.query;
        const { user_id, user_circles } = req.user;

        let query = {};
        let interest_condition = {};
        let circle_condition = {};
        let type_condition = {};
        let extra;

        query.deleted = false;
        query.approved = true;

        interest_condition.where = { user_id };
        interest_condition.required = false;

        if (!approved) {
            query.submit_by_user_id = user_id;
        }

        if (approved === "false") {
            query.approved = false;
        }

        if (date && date !== 'all') {
            const dt = moment().subtract(+date, 'day')._d;
            query.created_at = { [Op.gte]: dt };
        }

        if (type) {
            type_condition.where = { deal_type_id: { [Op.eq]: +type } };
        }

        if (frequency && amount) {

            if (frequency === "gt") {
                query.minimum_investment = { [Op.gt] : +amount };
            } else {
                query.minimum_investment = { [Op.lt] : +amount };
            }
        }

        if (category) {
            query.deal_category_id = { [Op.eq]: +category };
        }

        if (sub_category) {
            query.deal_sub_category_id = { [Op.eq]: +sub_category };
        }

        if (circle && circle !== 'all') {
            circle_condition.where = { circle_id: { [Op.eq]: +circle } };
        }

        let deals = await dealFinder(query, interest_condition, circle_condition, type_condition, user_id);

        if (!approved) {
            
            query.submit_by_user_id = { [Op.ne]: user_id };
            const circles = user_circles.map(user_circle => user_circle.circle_id);

            if (circle && circle !== 'all') {
                circle_condition.where = { circle_id: { [Op.eq]: +circle } };
            } else {
                circle_condition.where = { circle_id: { [Op.in]: circles } };
            }

            extra = await dealFinder(query, interest_condition, circle_condition, type_condition, user_id);
            deals = [...deals, ...extra];
        }

        if (approved === "false") {
            deals = deals.filter(deal => deal.deal_circles.length > 0);
        }

        if (deals.length === 0) {
            return res.status(OK).send({
                success: true,
                message: 'No deals are available!',
                deals
            });
        }

        res.status(OK).send({
            success: true,
            message: 'Deals retrieved successfully!',
            deals: modifyDealRecords(deals, req.user)
        });

    } catch (err) {
        next(err);
    }
}

exports.modifyDeal = async (req, res, next) => {

    try {

        const { deal_id } = req.params;

        const { 
            submit_by_user_id, 
            deal_circles,
            approved,
            ...dealAttributes
        } = req.body;

        if (approved) {

            return res.status(CONFLICT).send({
                error: true,
                message: 'Sorry deal has been approved already!'
            });
        }
    
        if (+submit_by_user_id === req.user.user_id || req.user.user_type.role === "Admin") {

            await models.deal.update(
                dealAttributes,
                {
                    where: {
                        deal_id
                    }
                }
            );

            if (deal_circles) {

                if (deal_circles.length > 0) {

                    let deal_circle_ids = [];

                    deal_circles.forEach(async circle => {
                        
                        const deal_circle = await models.deal_circle.findOrCreate({
                            where: {
                                deal_id,
                                circle_id: circle
                            },
                            defaults: {
                                added_by_user_id: req.user.user_id,
                                date_added: Date.now()
                            }
                        });

                        deal_circle_ids.push(deal_circle[0].deal_circle_id);

                        if (deal_circle_ids.length === deal_circles.length) {

                            await models.deal_circle.destroy({
                                where: {
                                    deal_id,
                                    deal_circle_id: {
                                        [Op.notIn]: deal_circle_ids
                                    }
                                }
                            });

                            return res.status(OK).send({
                                success: true,
                                message: 'Deal has been modified successfully!'
                            });
                        }

                    });
        
                } else {

                    await models.deal_circle.destroy({
                        where: {
                            deal_id
                        }
                    });

                    return res.status(OK).send({
                        success: true,
                        message: 'Deal has been modified successfully!'
                    });
                }
            }

            return res.status(OK).send({
                success: true,
                message: 'Deal has been modified successfully!'
            });
    
        } else {

            return res.status(FORBIDDEN).send({
                error: true,
                message: 'User is not authorized to modify this deal!'
            });
        }

    } catch (err) {
        next(err);
    }
}

exports.uploadDocuments = async (req, res, next) => {

    try {

        const { deal_id } = req.params;
        const deal_document_ids = [];

        req.files.forEach(async (file, index) => {

            const newFile = await models.deal_document.create({
                deal_id,
                file_name: file.originalname,
                file_type: file.mimetype,
                submit_date: Date.now(),
                submit_by_user_id: req.user.user_id,
                file_size: file.size,
                short_description: req.files.length === 1 ? req.body.short_description : req.body.short_description[index],
                private: req.body.private ? +req.body.private : 0
            });

            if (!newFile) {

                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Deal document(s) failed to upload!'
                });
            }

            deal_document_ids.push(newFile.deal_document_id);
            
            var params = {
                Bucket: bucket,
                Key: `documents/${newFile.deal_id}/${newFile.deal_document_id}-${file.originalname}`,
                Body: file.buffer.toString('base64')
            };

            s3bucket.upload(params, async (err, data) => {

                if (err) {
                    res.status(EXPECTATION_FAILED).send(err);
                } else {
                    res.status(OK).end();
                }

                await models.deal_document.update(
                    { storage_location: data.Location },
                    { where: { deal_document_id: newFile.deal_document_id } }
                );

            });

            if (req.files.length === index + 1) {

                return res.status(OK).send({
                    success: true,
                    deal_document_ids,
                    message: 'Deal documents uploaded successfully!'
                });
            }
        });

    } catch (err) {
        next(err);
    }
}

exports.modifyDocuments = async (req, res, next) => {

    try {

        const { deal_id } = req.params;
        const { deal, deal_documents } = req.body;
        
        const deal_document_ids = []; 

        if (JSON.parse(deal).approved) {

            return res.status(CONFLICT).send({
                error: true,
                message: 'Sorry deal has been approved already!'
            });
        }

        if (deal_documents) {

            if (Array.isArray(deal_documents)) {
            
                deal_documents.forEach(async deal_document => {
        
                    const { deal_document_id, short_description } = JSON.parse(deal_document);
                    deal_document_ids.push(deal_document_id);
                    
                    await models.deal_document.update(
                        { short_description },
                        { where: { deal_document_id } }
                    );
                });

            } else {

                const { deal_document_id, short_description } = JSON.parse(deal_documents);
                deal_document_ids.push(deal_document_id);
                
                await models.deal_document.update(
                    { short_description },
                    { where: { deal_document_id } }
                );
            }
        }

        req.files.forEach(async (file, index) => {

            const newFile = await models.deal_document.create({
                deal_id,
                file_name: file.originalname,
                file_type: file.mimetype,
                submit_date: Date.now(),
                submit_by_user_id: req.user.user_id,
                file_size: file.size,
                short_description: req.files.length === 1 ? req.body.short_description : req.body.short_description[index]
            });

            if (!newFile) {

                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Deal document(s) failed to upload!'
                });
            }

            deal_document_ids.push(newFile.deal_document_id);

            var params = {
                Bucket: bucket,
                Key: `documents/${newFile.deal_id}/${newFile.deal_document_id}-${file.originalname}`,
                Body: file.buffer.toString('base64')
            };
            s3bucket.upload(params, async (err, data) => {

                if (err) {
                    res.status(EXPECTATION_FAILED).send(err);
                } else {
                    res.status(OK).end();
                }

                await models.deal_document.update(
                    { storage_location: data.Location },
                    { where: { deal_document_id: newFile.deal_document_id } }
                );

            });

            if (index + 1 === req.files.length) {
                
                await models.deal_document.update(
                    {
                        deleted: true,
                        deleted_by_user_id: req.user.user_id,
                        deleted_datetime: Date.now()
                    },
                    {
                        where: {
                            deal_id,
                            deal_document_id: {
                                [Op.notIn]: deal_document_ids
                            }
                        }
                    }    
                );

                return res.status(OK).send({
                    success: true,
                    message: 'Deal documents uploaded successfully!'
                });
            }
        });

        if (!req.files.length) {

            await models.deal_document.update(
                {
                    deleted: true,
                    deleted_by_user_id: req.user.user_id,
                    deleted_datetime: Date.now()
                },
                {
                    where: {
                        deal_id,
                        deal_document_id: {
                            [Op.notIn]: deal_document_ids
                        }
                    }
                }
            );

            return res.status(OK).send({
                success: true,
                message: 'Deal documents uploaded successfully!'
            });
        }
    } catch (err) {
        next(err);
    }
}

exports.dealDocumentById = async (req, res, next) => {

    try {

        const { deal_document_id } = req.params;

        const document = await models.deal_document.findOne({
            where: {
                deal_document_id,
                deleted: false,
                [Op.or]: [
                    { private: { [Op.eq]: false } },
                    {
                        [Op.and]: [
                            { private: { [Op.eq]: true } },
                            { submit_by_user_id: req.user.user_id }
                        ]
                    }
                ]
            }
        });

        if (!document) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal document not found!'
            });
        }

        res.status(OK).send({
            success: true,
            document,
            message: 'Deal document retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealById = async (req, res, next) => {

    try {

        const { deal_id } = req.params;

        const deal = await models.deal.findOne({
            where: {
                deleted: false,
                deal_id
            },
            include: [
                {
                    model: models.deal_status
                },
                {
                    model: models.deal_category,
                    include: [
                        {
                            model: models.deal_type
                        }
                    ]
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
                                    { submit_by_user_id: req.user.user_id }
                                ]
                            }
                        ]
                    },
                    required: false
                },
                {
                    model: models.user_deal_interest
                },
                {
                    model: models.industry
                }
            ]
        });

        if (!deal) {

            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal not found!'
            });
        }

        if (!deal.user_deal_interests.length) {

            await models.user_deal_interest.create({
                user_id: req.user.user_id,
                deal_id: deal.deal_id,
                first_viewed_date: Date.now(),
                date_added: Date.now()
            });

        } else {

            const user_deal_interest = await models.user_deal_interest.findOne({
                where: {
                    deal_id: deal.deal_id
                }
            });

            await user_deal_interest.update({
                last_viewed_date: Date.now(),
                view_counter: user_deal_interest.view_counter + 1 
            });
        }

        res.status(OK).send({
            success: true,
            message: 'Deal retrieved successfully!',
            deal: modifyDealRecords(deal, req.user)
        });

    } catch (err) {
        next(err);
    }
}

exports.dealByShortcode = async (req, res, next) => {

    try {

        const { shortcode } = req.params;

        const deal = await models.deal.findOne({
            where: {
                deleted: false,
                shortcode
            },
            include: [
                {
                    model: models.deal_status
                },
                {
                    model: models.deal_category,
                    include: [
                        {
                            model: models.deal_type
                        }
                    ]
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
                                    { submit_by_user_id: req.user.user_id }
                                ]
                            }
                        ]
                    },
                    required: false
                },
                {
                    model: models.user_deal_interest
                },
                {
                    model: models.industry
                }
            ]
        });

        if (!deal) {

            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal not found'
            });

        }

        if (!deal.user_deal_interests.length) {

            await models.user_deal_interest.create({
                user_id: req.user.user_id,
                deal_id: deal.deal_id,
                first_viewed_date: Date.now(),
                date_added: Date.now()
            });

        } else {

            const user_deal_interest = await models.user_deal_interest.findOne({
                where: {
                    deal_id: deal.deal_id
                }
            });

            await user_deal_interest.update({   
                last_viewed_date: Date.now(),
                view_counter: user_deal_interest.view_counter + 1 
            });
        }

        res.status(OK).send({
            success: true,
            message: 'Deal retrieved successfully!',
            deal: modifyDealRecords(deal, req.user),
        });

    } catch (err) {
        next(err);
    }
}

exports.addCircleToDeal = async (req, res, next) => {

    try {

        const { circle_id } = req.body;
        const { deal_id } = req.params;

        if (req.user.user_type.role === 'Admin') {

            const [deal_circle, created] = models.deal_circle.findOrCreate({
                where: {
                    deal_id,
                    circle_id,
                    added_by_user_id: req.user.user_id
                },
                defaults: {
                    date_added: new Date().toISOString()
                }
            });

            if (!deal_circle) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Circle addition to the deal failed!'
                })
            }

            res.status(OK).send({
                success: true,
                message: 'Circle added to the deal successfully!'
            });

        } else {

            const user_circle = await models.user_circle.findOne({
                where: {
                    user_id,
                    circle_id
                }
            });

            if (!user_circle) {

                return res.status(NOT_FOUND).send({
                    error: true,
                    message: 'Requesting user does not belong to the desired circle!'
                })
            }

            const [deal_circle, created] = models.deal_circle.findOrCreate({
                where: {
                    deal_id,
                    circle_id,
                    added_by_user_id: req.user.user_id
                },
                defaults: {
                    date_added: new Date().toISOString()
                }
            });

            if (!deal_circle) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Circle addition to the deal failed!'
                })
            }

            res.status(OK).send({
                success: true,
                message: 'Circle added to the deal successfully!'
            });
        }

    } catch (err) {
        next(err);
    }
}

exports.removeCircleFromDeal = async (req, res, next) => {

    try {
        const { circle_id, deal_id } = req.params;

        if (req.user.user_type.role === 'Admin') {

            const deleted = await models.deal_circle.destroy({
                where: {
                    deal_id,
                    circle_id
                }
            });

            if (!deleted[0]) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Circle removal from the deal failed!'
                })
            }

            res.status(OK).send({
                success: true,
                message: 'Circle removed from the deal successfully!'
            });

        } else {

            const deleted = await models.deal_circle.destroy({
                where: {
                    deal_id,
                    circle_id,
                    added_by_user_id: req.user.user_id
                }
            });

            if (!deleted[0]) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'User can\'t remove circle from the deal!'
                })
            }

            res.status(OK).send({
                success: true,
                message: 'Circle removed from the deal successfully!'
            });
        } 

    } catch (err) {
        next(err);
    }
}

exports.removeDealDocument = async (req, res, next) => {

    try {

        const { deal_document_id } = req.params;

        const deleted = await models.deal_document.update(
            {
                deleted: true,
                deleted_by_user_id: req.user.user_id,
                deleted_datetime: Date.now()
            },
            {
                where: {
                    deal_document_id
                }
            }    
        );
            
        if (!deleted[0]) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'Deal document deletion failed!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'Deal document deleted successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.interest = async (req, res, next) => {  

    try {

        const { deal_id } = req.params;
        const { user_id } = req.user;
        let updateParams = {};

        let { interest_level_id, notes, anticipated_investment, interest_reason, funds_needed_date, hold_period, projected_irr, projected_multiple } = req.body;
        
        const user_deal_interest = await models.user_deal_interest.findOne({ where: { user_id, deal_id } });

        if (user_deal_interest) {

            const { interest_level_updated_date } = user_deal_interest;
            const condition = interest_level_id && interest_level_id !== user_deal_interest.interest_level_id;
            let interest_updated_date = '';
 
            if (condition) {

                interest_updated_date = Date.now();

                await models.user_deal_interest_history.create({
                    user_id,
                    deal_id,
                    change_date: Date.now(),
                    from_interest_level_id: user_deal_interest.interest_level_id, 
                    to_interest_level_id: interest_level_id,
                    from_interest_reason: user_deal_interest.interest_reason,
                    to_interest_reason: interest_reason
                });
            }

            if (interest_level_id)
                updateParams.interest_level_id = interest_level_id;
            if (notes)
                updateParams.notes = notes;
            if (anticipated_investment)
                updateParams.anticipated_investment = anticipated_investment;
            if (interest_reason)
                updateParams.interest_reason = interest_reason;
            if (funds_needed_date)
                updateParams.funds_needed_date = funds_needed_date;
            if (hold_period)
                updateParams.hold_period = hold_period;
            if (projected_irr)
                updateParams.projected_irr = projected_irr;
            if (projected_multiple)
                updateParams.projected_multiple = projected_multiple;

            updateParams.interest_level_updated_date = condition ? interest_updated_date : interest_level_updated_date;
            
            const modified = await user_deal_interest.update(updateParams);

            if (!modified) {

                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Deal interest has been failed to update!'
                });
            }

            res.status(OK).send({
                success: true,
                message: 'Deal interest has been updated successfully!'
            });

        } else {

            const created = await models.user_deal_interest.create({
                user_id,
                deal_id,
                interest_level_id,
                notes,
                anticipated_investment,
                interest_reason,
                funds_needed_date,
                hold_period,
                projected_irr,
                projected_multiple,
                first_viewed_date: Date.now(),
                date_added: Date.now()
            });

            if (!created) {

                return res.status(EXPECTATION_FAILED).send({
                    success: true,
                    message: 'Deal interest has been failed to set!'
                });
            }

            res.status(OK).send({
                success: true,
                message: 'Deal interest has been set successfully!'
            });
        }

    } catch (err) {
        next(err);
    }
}

exports.favorite = async (req, res, next) => {

    try {

        const { deal_id } = req.params;
        const { favorite } = req.body;
        const { user_id } = req.user;

        const user_deal_interest = await models.user_deal_interest.findOne({ where: { user_id, deal_id } });

        if (user_deal_interest) {

            const modified = await user_deal_interest.update({ favorite });

            if (!modified) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Deal favorite has been failed to toggle!'
                });
            }

            res.status(OK).send({
                success: true,
                message: 'Deal favorite has been toggled successfully!'
            });

        } else {

            const created = await models.user_deal_interest.create({
                user_id,
                deal_id,
                favorite,
                first_viewed_date: Date.now(),
                date_added: Date.now()
            });

            if (!created) {
                return res.status(EXPECTATION_FAILED).send({
                    error: true,
                    message: 'Deal has been failed to set as favorite!'
                });
            }

            res.status(OK).send({
                success: true,
                message: 'Deal has been set as favorite successfully!'
            });
        }

    } catch (err) {
        next(err);
    }
}

exports.dealsSummary = async (req, res, next) => {

    try {

        const { active } = req.query;

        let condition = {
            deleted: false
        };

        const summary = {
            deals: 0,
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

        // fetching deals summary
        const deals = await models.deal.findAll({
            where: condition
        });

        // total deals
        summary.deals = deals.length;

        deals.forEach(deal => {

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
            message: 'Deals summary have been retrieved successfully!',
            summary
        });

    } catch (err) {
        next(err);
    }
} 

exports.removeDealDocuments = async (req, res, next) => {

    try {

        const { deal_id } = req.params;
        const { 
            submit_by_user_id, 
            approved 
        } = req.body;

        if (approved) {

            return res.status(CONFLICT).send({
                error: true,
                message: 'Sorry deal has been approved already!'
            });
        }

        if (+submit_by_user_id === req.user.user_id || req.user.user_type.role === "Admin") {

            await models.deal_document.update(
                {
                    deleted: true,
                    deleted_by_user_id: req.user.user_id,
                    deleted_datetime: Date.now()
                },
                {
                    where: {
                        deal_id
                    }
                }  
            );
    
            res.status(OK).send({
                success: true,
                message: 'Deal documents has been removed successfully!'
            });

        } else {

            return res.status(FORBIDDEN).send({
                error: true,
                message: 'User is not authorized to remove deal documents!'
            });

        }

    } catch (err) {
        next(err);
    }
}

exports.getDealDocuments = async (req, res, next) => {

    try {

        const { deal_id } = req.params;

        const deal_documents = await models.deal_document.findAll({
            where: {
                deal_id,
                deleted: false,
                [Op.or]: [
                    { private: { [Op.eq]: false } },
                    {
                        [Op.and]: [
                            { private: { [Op.eq]: true } },
                            { submit_by_user_id: req.user.user_id }
                        ]
                    }
                ]
            }
        });

        if (deal_documents.length === 0) {

            return res.status(OK).send({
                success: true,
                message: 'No deal documents are available!',
                deal_documents
            });
        }
    
        res.status(OK).send({
            success: true,
            message: 'Deal documents has been retrieved successfully!',
            deal_documents
        });

    } catch (err) {
        next(err);
    }
}

exports.removeDeal = async (req, res, next) => {

    try {

        const { deal_id } = req.params;

        const soft_deleted = await models.deal.update(
            {
                deleted: true,
                deleted_by_user_id: req.user.user_id,
                deleted_datetime: Date.now()
            },
            {
                where: {
                    deal_id
                }
            }
        );

        if (!soft_deleted[0]) {
            return res.status(EXPECTATION_FAILED).send({
                error: true,
                message: 'Deal document deletion failed!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'Deal has been removed successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.gmailMessages = async (req, res, next) => {

    try {

        const messages = [];
        const gmail = google.gmail({version: 'v1', auth: global.oauth2client});
        
        // retrieving inbox list having message ids
        const list = await gmail.users.messages.list({
            userId: dealsGmailAccount,
            labelIds: ['INBOX']
        });

        // Check for empty inbox
        if (!list.data.messages) {
            return res.status(OK).send({
                success: true,
                message: 'Messages list is empty',
                messages
            });
        }
        
        // generating message ids array from list
        const messageIds = list.data.messages.map(message => message.id);

        messageIds.forEach(async msgId => {

            // fetching message by id
            const msg = await gmail.users.messages.get({
                userId: dealsGmailAccount,
                id: msgId
            });
                
            messages.push(msg);

            if (messages.length === messageIds.length) {

                console.log(messages.length, messageIds.length);

                res.status(OK).send({
                    success: true,
                    message: 'Messages list has been retrieved successfully',
                    messageIds,
                    messages
                });
            }
        });

    } catch (err) {
        next(err);
    }
}

exports.downloadFileFromS3 = async (req, res, next) => {

    try {

        const { deal_document_id } = req.query;

        const deal_document = await models.deal_document.findOne({
            where: {
                deal_document_id,
                deleted: false
            }
        });

        if (!deal_document) {

            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Deal document is not existed!'
            });
        }

        const { deal_id, file_name } = deal_document;

        let options = {
            Bucket: bucket,
            Key: `documents/${deal_id}/${deal_document_id}-${file_name}`
        };
    
        s3bucket.getObject(options, async (err, data) => {

            if (err) {
                return res.status(EXPECTATION_FAILED).send(err);
            }

            await models.deal_document_activity.create({
                user_id: req.user.user_id,
                date: Date.now()
            });

            res.status(OK).send({
                success: true,
                message: 'File is downloaded from S3 successfully!',
                data
            });

        });

    } catch (err) {
        next(err);
    }
}

exports.addToMyDeals = async (req, res, next) => {

    try {

        const { deal_id } = req.body;

        const [, created] = await models.user_deal_interest.findOrCreate({
            where: {
                user_id: req.user.user_id,
                deal_id,
            },
            defaults: {
                view_counter: 0,
                date_added: Date.now()
            }
        });

        if (!created) {
            return res.status(CONFLICT).send({
                error: true,
                message: 'Deal is already added in your deals!'
            });
        }

        res.status(OK).send({
            success: true,
            message: 'Deal is added in your deals successfully!'
        });

    } catch (err) {
        next(err);
    }
}

exports.dealInterestHistory = async (req, res, next) => {

    try {

        const { deal_id } = req.params;
        const { user_id } = req.user;

        const interest_history = await models.user_deal_interest_history.findAll({
            where: {
                deal_id,
                user_id
            },
            include: [
                {
                    model: models.interest_level,
                    as: 'from_interest'
                },
                {
                    model: models.interest_level,
                    as: 'to_interest'
                }
            ]
        });

        if (!interest_history) {
            return res.status(NOT_FOUND).send({
                error: true,
                message: 'Interest history failed to retrieve!'
            });
        }

        if (interest_history.length === 0) {
            return res.status(OK).send({
                success: true,
                interest_history,
                message: 'No interest history is available!'
            });
        }

        res.status(OK).send({
            success: true,
            interest_history,
            message: 'Interest history retrieved successfully!'
        });

    } catch (err) {
        next(err);
    }
}