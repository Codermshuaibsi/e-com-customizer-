const express = require('express');
const router = express.Router();
const discountController = require('../controllers/DiscountControllers');
const { auth, isAdmin } = require('../middleware/auth');

// Only admin can create a discount
router.post('/discounts', auth, isAdmin, discountController.createDiscount);

// Both admin and users can view discounts (if needed), or restrict to admin only
router.get('/discounts', auth, discountController.getDiscounts);

// Only admin can update a discount
router.put('/discounts/:id', auth, isAdmin, discountController.updateDiscount);

// Only admin can delete a discount
router.delete('/discounts/:id', auth, isAdmin, discountController.deleteDiscount);

module.exports = router;
