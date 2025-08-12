const express = require('express');
const router = express.Router();
const { getPurchaseHistory, getInvoiceById } = require('../Controllers/invoice');
const { authenticate } = require('../Middlewares/auth');

// Get user's purchase history
router.get('/purchase-history', authenticate, getPurchaseHistory);

// Get specific invoice details
router.get('/invoice/:invoiceId', authenticate, getInvoiceById);

module.exports = router;
