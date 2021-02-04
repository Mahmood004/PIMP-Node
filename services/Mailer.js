const sgMail = require('@sendgrid/mail');
const { sendgridApiKey, sendgridEmail } = require('../config');

sgMail.setApiKey(sendgridApiKey);
let instance = null;

class Mailer {

    constructor() {
        this.to = null;
        this.from = null;
        this.template = null;
        this.data = null;
    }

    initializeTemplate(template, data) {
        this.to = data.email;
        this.from = sendgridEmail;
        this.template = template;
        this.data = data;
    }

    static getInstance() {

        if (!instance) {
            instance = new Mailer();
        }
        return instance;
    }

    send() {
        
        const msg = {
            to: this.to,
            from: this.from,
            templateId: this.template,
            dynamic_template_data: this.data
        }

        sgMail.send(msg);
    }
}

module.exports = Mailer;