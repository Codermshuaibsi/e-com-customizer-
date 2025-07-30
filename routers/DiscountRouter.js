    const express = require('express');
    const router = express.Router();
    const discountController = require('../controllers/DiscountControllers');

    router.post('/discounts', discountController.createDiscount);
    router.get('/discounts', discountController.getDiscounts);
    router.put('/discounts/:id', discountController.updateDiscount);
    router.delete('/discounts/:id', discountController.deleteDiscount);

    module.exports = router;
