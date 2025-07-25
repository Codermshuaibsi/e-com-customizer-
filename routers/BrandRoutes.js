const express = require("express");
const router = express.Router();
const brandController = require("../controllers/BrandControllers");

// Create a brand
router.post("/createBrand", brandController.createBrand);

// Get all brands
router.get("/totalBrands", brandController.getAllBrands);

// Get brand by ID
router.get("/brand/:id", brandController.getBrandById);

// Update brand by ID
router.put("/brand/:id", brandController.updateBrand);

// Delete brand by ID
router.delete("/brand/:id", brandController.deleteBrand);

// Toggle brand status by ID
router.put("/brand/toggle/:id", brandController.updateToggleBrand);
module.exports = router;
