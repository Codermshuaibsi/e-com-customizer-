const express = require("express");
const router = express.Router();
const TaxController = require("../controllers/TaxController");

// Create a tax
router.post("/addTax", TaxController.createTax);

// Get all taxes
router.get("/totalTax", TaxController.getAllTax);

// Get tax by ID
router.get("/tax/:id", TaxController.getTaxtById);

// Update tax by ID
router.put("/tax/:id", TaxController.updateTax);

router.put("/taxToggle/:id", TaxController.updateToggleTax);

// Delete tax by ID
router.delete("/tax/:id", TaxController.deleteTax);

module.exports = router;
