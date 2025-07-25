const Tax = require("../models/TaxModel");

// Create
exports.createTax = async (req, res) => {
  try {
    const exist = await Tax.findOne({ name: req.body.name });
    if (exist) {
        return res.status(400).json({ message: "Tax already exists" });
    }
    const { name, active } = req.body;
    const newTax = new Tax({ name, active });
    await newTax.save();
    res.status(201).json({ message: "Tax created", data: newTax });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All
exports.getAllTax = async (req, res) => {
  try {
    const taxes = await Tax.find();
    res.status(200).json({ data: taxes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get by ID
exports.getTaxtById = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id);
    if (!tax) return res.status(404).json({ message: "Tax not found" });
    res.status(200).json({ data: tax });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateTax = async (req, res) => {
  try {
    const updated = await Tax.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Tax not found" });
    res.status(200).json({ message: "Tax updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteTax = async (req, res) => {
  try {
    const deleted = await Tax.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tax not found" });
    res.status(200).json({ message: "Tax deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateToggleTax = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id);
    if (!tax) return res.status(404).json({ message: "Tax not found" });

    tax.active = !tax.active;
    await tax.save();

    res.status(200).json({ message: "Tax status updated", data: tax });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
