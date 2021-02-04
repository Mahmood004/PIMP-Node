module.exports = ({ first_name, last_name, shortcode }) => {
    return `
        <div>
            <p>Hi ${first_name + ' ' + last_name},</p>
            <p>Please find the shortcode to join the specified circle invitation.</p>

            <p><strong>Shortcode:</strong> ${shortcode}</p>
        </div>
    `
}