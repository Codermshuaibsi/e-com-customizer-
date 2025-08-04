const express = require("express");
const router = express.Router();
const UnitController = require("../controllers/UnitController");
const { isAdmin, auth } = require("../middleware/auth");

// Create a unit
router.post("/addUnit", auth, isAdmin, UnitController.createUnit);

// Get all units
router.get("/totalUnit", UnitController.getAllUnit);

// Get unit by ID
router.get("/unit/:id", UnitController.getUnitById);

// Update unit by ID
router.put("/unit/:id", auth, isAdmin, UnitController.updateUnit);

// Toggle unit status by ID
router.put("/unitToggle/:id", auth, isAdmin, UnitController.updateToggleUnit);

// Delete unit by ID
router.delete("/unit/:id", auth, isAdmin, UnitController.deleteUnit);

module.exports = router;
