const express = require('express');
const { circle } = require('../controllers');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.use(isAuth);

router.get('/circle/:circle_id/deals', circle.dealsPerCircle);

router.get('/circles', circle.circles);

router.get('/circle/:circle_id/members', circle.circleMembers);

router.get('/circle/:circle_id/invites', circle.circleInvites);


router.post('/circle', circle.insertCircle);

router.post('/circle/:circle_id/invite', circle.inviteUserToCircle);

router.post('/invite/:invite_id/accept', circle.acceptInvitationById);

router.post('/invite/:invite_id/approve', circle.approveInvitation);

router.post('/circle/:circle_id/admin', circle.assignCircleAdmin);


router.delete('/circle/:circle_id/admin/:user_id', circle.removeCircleAdmin)

module.exports = router;