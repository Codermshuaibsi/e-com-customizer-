const Variation = require("../models/VariationModel");

// Create
exports.createVariation = async (req, res) => {
  try {
    const exist = await Variation.findOne({ name: req.body.name });
    if (exist) {
        return res.status(400).json({ message: "Variation already exists" });
    }
    const { name, active } = req.body;
    const newVariation = new Variation({ name, active });
    await newVariation.save();
    res.status(201).json({ message: "Variation created", data: newVariation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All
exports.getAllVariations = async (req, res) => {
  try {
    const variations = await Variation.find();
    res.status(200).json({ data: variations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get by ID
exports.getVariationById = async (req, res) => {
  try {
    const variation = await Variation.findById(req.params.id);
    if (!variation) return res.status(404).json({ message: "Variation not found" });
    res.status(200).json({ data: variation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateVariation = async (req, res) => {
  try {
    const updated = await Variation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Variation not found" });
    res.status(200).json({ message: "Variation updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteVariation = async (req, res) => {
  try {
    const deleted = await Variation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Variation not found" });
    res.status(200).json({ message: "Variation deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateToggleVariation = async (req, res) => {
  try {
    const variation = await Variation.findById(req.params.id);
    if (!variation) return res.status(404).json({ message: "Variation not found" });

    variation.active = !variation.active;
    await variation.save();

    res.status(200).json({ message: "Variation status updated", data: variation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
