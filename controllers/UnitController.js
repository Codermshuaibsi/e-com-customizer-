const Unit = require("../models/UnitModel");

// Create
exports.createUnit = async (req, res) => {
  try {
    const exist = await Unit.findOne({ name: req.body.name });
    if (exist) {
        return res.status(400).json({ message: "Unit already exists" });
    }
    const { name, active } = req.body;
    const newUnit = new Unit({ name, active });
    await newUnit.save();
    res.status(201).json({ message: "Unit created", data: newUnit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All
exports.getAllUnit = async (req, res) => {
  try {
    const units = await Unit.find();
    res.status(200).json({ data: units });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get by ID
exports.getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.status(200).json({ data: unit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateUnit = async (req, res) => {
  try {
    const updated = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Unit not found" });
    res.status(200).json({ message: "Unit updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteUnit = async (req, res) => {
  try {
    const deleted = await Unit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Unit not found" });
    res.status(200).json({ message: "Unit deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateToggleUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    unit.active = !unit.active;
    await unit.save();

    res.status(200).json({ message: "Unit status updated", data: unit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
