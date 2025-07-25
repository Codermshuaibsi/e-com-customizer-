const express = require("express");
const router = express.Router();
const variationController = require("../controllers/VariationController");

// Create a variation
router.post("/addVariation", variationController.createVariation);

// Get all variations
router.get("/totalVariation", variationController.getAllVariations);

// Get variation by ID
router.get("/variation/:id", variationController.getVariationById);

// Update variation by ID
router.put("/variation/:id", variationController.updateVariation);

router.put("/variationToggle/:id", variationController.updateToggleVariation);

// Delete variation by ID
router.delete("/variation/:id", variationController.deleteVariation);

module.exports = router;
