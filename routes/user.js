const express = require('express');
const { user } = require('../controllers');
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const { check } = require('express-validator');

const router = express.Router();

router.post('/user/:email/reset', user.resetPasswordRequest);

router.post('/reset-password', user.resetPassword);

router.get('/social-user-info', user.socialUserInfo);

router.use(isAuth);

router.get('/users', isAdmin, user.users);

router.patch('/user/:user_id/approve', isAdmin, user.approveUser);

router.patch('/update-password', user.updatePassword);

router.route('/user/:user_id')
    .get(user.getUser)
    .delete(user.deleteUser)
    .patch(user.modifyUser)

router.get('/user/:user_id/circles', user.userCircles);

router.get('/user/:user_id/deals', user.userDeals);

router.get('/user/:user_id/industries', user.userIndustries);

router.get('/user/:user_id/user-deal-category', user.userDealCategory);

router.get('/user/:user_id/invitations', user.userInvitations);

router.get('/deal', user.filteredDeals);

router.get('/user-profile-types', user.userProfileTypes);

router.get('/user/:user_id/deals/summary', user.dealsSummary);

router.get('/user/:user_id/circles/summary', user.circlesSummary);


router.post('/user/:user_id/user-deal-category', user.insertUserDealCategory);

router.post('/user/:user_id/remove-user-deal-category', user.removeUserDealCategory);

router.post('/user/:user_id/industry', check('relationship_type').isIn(['E', 'I']), user.insertIndustry);

router.route('/user/:user_id/deal/:deal_id/activity')
        .post(user.insertUserDealActivity)
        .get(user.getUserDealActivity);

module.exports = router;