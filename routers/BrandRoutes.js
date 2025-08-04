const express = require("express");
const router = express.Router();
const brandController = require("../controllers/BrandControllers");
const { auth, isAdmin } = require("../middleware/auth");

// Create a brand
router.post("/createBrand", auth, isAdmin, brandController.createBrand);

// Get all brands
router.get("/totalBrands", brandController.getAllBrands);

// Get brand by ID
router.get("/brand/:id", brandController.getBrandById);

// Update brand by ID
router.put("/brand/:id", auth, isAdmin, brandController.updateBrand);

// Delete brand by ID
router.delete("/brand/:id", auth, isAdmin, brandController.deleteBrand);

// Toggle brand status by ID
router.put("/brand/toggle/:id", auth, isAdmin, brandController.updateToggleBrand);
module.exports = router;
