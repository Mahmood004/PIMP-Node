const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { linkedinClientID, linkedinClientSecret } = require('../config');

const models = require('../models');

exports.linkedin = () => {

    passport.use(new LinkedInStrategy({
        clientID: linkedinClientID,
        clientSecret: linkedinClientSecret,
        callbackURL: "/api/v1/auth/linkedin/callback",
        scope: ['r_emailaddress', 'r_liteprofile']
        
    }, async function(accessToken, refreshToken, profile, done) {

        const { id, provider, name: { givenName, familyName }, emails } = profile;

        const role = await models.user_type.findOne({
            where: {
                role: 'User'
            }
        });

        const [user, created] = await models.User.findOrCreate({
            where: {
                email: emails[0].value
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
            ],
            defaults: {
                first_name: givenName,
                last_name: familyName,
                email: emails[0].value,
                user_type_id: role.user_type_id,
                provider_id: id,
                provider_name: provider
            }
        });
                
        return done(null, user.get({ plain: true }));
    }));
}