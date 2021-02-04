const { baseAddress } = require('../../config');

module.exports = ({ first_name, last_name, shortcode }) => {
    return `
        <div>
            <p>Hi ${first_name + ' ' + last_name},</p>
            <p>Please find the shortcode and the registration link below to accept circle invitation.</p>

            <p><strong>Shortcode:</strong> ${shortcode}</p>
            <p><strong>Registration:</strong> <a target="_blank" href="${baseAddress + '/signup?shortcode=' + shortcode}">Click here</a></p>
        </div>
    `
}