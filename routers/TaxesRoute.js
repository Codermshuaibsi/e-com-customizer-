const express = require("express");
const router = express.Router();
const TaxController = require("../controllers/TaxController");
const { isAdmin, auth } = require("../middleware/auth");

// Create a tax
router.post("/addTax", auth, isAdmin, TaxController.createTax);

// Get all taxes
router.get("/totalTax", TaxController.getAllTax);

// Get tax by ID
router.get("/tax/:id", TaxController.getTaxtById);

// Update tax by ID
router.put("/tax/:id", auth, isAdmin, TaxController.updateTax);

router.put("/taxToggle/:id", auth, isAdmin, TaxController.updateToggleTax);

// Delete tax by ID
router.delete("/tax/:id", auth, isAdmin, TaxController.deleteTax);

module.exports = router;
