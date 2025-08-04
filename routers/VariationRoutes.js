const express = require("express");
const router = express.Router();
const variationController = require("../controllers/VariationController");
const { isAdmin, auth } = require("../middleware/auth");

// Create a variation
router.post("/addVariation",auth, isAdmin, variationController.createVariation);

// Get all variations
router.get("/totalVariation", variationController.getAllVariations);

// Get variation by ID
router.get("/variation/:id", variationController.getVariationById);

// Update variation by ID
router.put("/variation/:id",auth, isAdmin, variationController.updateVariation);

router.put("/variationToggle/:id",auth, isAdmin, variationController.updateToggleVariation);

// Delete variation by ID
router.delete("/variation/:id",auth, isAdmin, variationController.deleteVariation);

module.exports = router;
