const express = require('express');
const { deal } = require('../controllers');
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.get('/deal_sub_category/:deal_sub_category_id/category/type', deal.dealCategoryAndTypeBySubCategory);

router.get('/deal-types', deal.dealTypes);

router.get('/deal-instruments', deal.dealInstruments);

router.get('/deal-activities', deal.dealActivities);

router.post('/deal-without-auth', deal.insertDealWithoutAuth);

router.use(isAuth);

router.get('/deal-statuses', deal.dealStatuses);

router.get('/deal-categories', deal.dealCategories);

router.get('/type/:type_id/categories', deal.dealCategoriesByTpye);

router.get('/deal-sub-categories', deal.dealSubCategories);

router.get('/category/:category_id/sub-categories', deal.dealSubCategoriesByCategory);



router.get('/deals', deal.deals);

router.get('/deal/:shortcode/shortcode', deal.dealByShortcode);

router.get('/deals/summary', deal.dealsSummary);

router.get('/gmail-messages', isAdmin, deal.gmailMessages);

router.get('/s3-file-download', deal.downloadFileFromS3);

router.get('/deal/:deal_id/interest-history', deal.dealInterestHistory);


router.post('/deal/:deal_id/circle', deal.addCircleToDeal);

router.post('/deal', deal.insertDeal);

router.post('/deal/:deal_id/favorite', deal.favorite);

router.post('/deal/:deal_id/interest', deal.interest);

router.post('/add', deal.addToMyDeals);


router.patch('/deal/:deal_id/approve', isAdmin, deal.approveDeal);


router.delete('/deal/:deal_id/circle/:circle_id', deal.removeCircleFromDeal);

router.route('/deal/:deal_id/documents')
        .get(deal.getDealDocuments)
        .post(deal.uploadDocuments)
        .put(deal.modifyDocuments)
        .delete(deal.removeDealDocuments);


router.route('/deal_document/:deal_document_id')
        .get(deal.dealDocumentById)
        .delete(deal.removeDealDocument);

router.route('/deal/:deal_id')
        .get(deal.dealById)
        .put(deal.modifyDeal)
        .delete(deal.removeDeal);


module.exports = router;