const express = require('express');
const router = express.Router();
const { requireAuth } = require('../app/middleware/AuthMiddleware');

const accountController = require('../app/controllers/AccountController');

router.get('/profile', requireAuth, accountController.profile_get);
router.get('/customer', requireAuth, accountController.customer_get);
router.get('/order', requireAuth, accountController.order_get);
router.get('/get-order', requireAuth, accountController.orderDetail_get);
router.get('/make-order', requireAuth, accountController.makeOrder_get);
router.get('/voucher', requireAuth, accountController.voucher_get);
router.get('/', requireAuth, accountController.profile_get);

module.exports = router;