const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY,
    environment: process.env.NODE_ENV,
    baseAddress: process.env.BASE_ADDRESS,
    mailchimpInstance: process.env.MAILCHIMP_INSTANCE,
    listUniqueId: process.env.LIST_UNIQUE_ID,
    mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
    linkedinClientID: process.env.LINKEDIN_CLIENT_ID,
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    defaultCircle: process.env.DEFAULT_CIRCLE,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    sendgridEmail: process.env.SENDGRID_EMAIL,
    inviteUserTemplate: process.env.SENDGRID_INVITE_USER_TEMPLATE,
    inviteNonUserTemplate: process.env.SENDGRID_INVITE_NON_USER_TEMPLATE,
    resetPasswordTemplate: process.env.SENDGRID_RESET_PASSWORD_TEMPLATE,
    dealViaMessageTemplate: process.env.SENDGRID_DEAL_VIA_MESSAGE_TEMPLATE,
    successfulSignupTemplate: process.env.SENDGRID_SUCCESSFUL_SIGNUP_TEMPLATE,
    dealsGmailAccount: process.env.DEALS_GMAIL_ACCOUNT
}