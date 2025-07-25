const express = require("express");
const router = express.Router();
const UnitController = require("../controllers/UnitController");

// Create a unit
router.post("/addUnit", UnitController.createUnit);

// Get all units
router.get("/totalUnit", UnitController.getAllUnit);

// Get unit by ID
router.get("/unit/:id", UnitController.getUnitById);

// Update unit by ID
router.put("/unit/:id", UnitController.updateUnit);

// Toggle unit status by ID
router.put("/unitToggle/:id", UnitController.updateToggleUnit);

// Delete unit by ID
router.delete("/unit/:id", UnitController.deleteUnit);

module.exports = router;
