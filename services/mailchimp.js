const request = require('superagent');
const { mailchimpInstance, mailchimpApiKey, listUniqueId } = require('../config');

exports.addUserToMailchimpList = user => {

    return request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + Buffer.from('any:' + mailchimpApiKey).toString('base64'))
        .send({
            'email_address': user.email,
            'status': 'subscribed',
            'merge_fields': {
                'FNAME': user.first_name,
                'LNAME': user.last_name
            }
        });
}