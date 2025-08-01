
const Color = require("../models/Color");

async function CreateColor(req, res) {

    const { colorname, active } = req.body;
    if (!colorname) {
        return res.status(200).json({
            message: "All Field Required",
            success: true
        })
    }

    try {

        const existingColor = await Color.findOne({ colorname });
        if (existingColor) {
            return res.status(200).json({
                message: "This color is already exist",
                success: true
            })
        }
        const newColor = new Color({ colorname, active });
        await newColor.save();
        res.status(201).json({ message: "Color created", data: newColor });


    } catch (error) {
        console.log(error);
    }

}

async function UpdateColor(req, res) {

    try {
        const updated = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "color not found" });
        res.status(200).json({ message: "color updated", data: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }


}
async function DeleteColor(req, res) {

    try {
        const Deleted = await Color.findByIdAndDelete(req.params.id);
        if (!Deleted) return res.status(404).json({ message: "color not found" });
        res.status(200).json({ message: "color Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }


}

async function getAllColor(req, res) {
    try {
        const color = await Color.find({});
        res.status(200).json({
            data: color,
            success: true
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function toggleColor(req, res) {
    try {
        const color = await Color.findById(req.params.id);
        if (!color) return res.status(404).json({ message: "color not found" });

        color.active = !color.active;
        await color.save();

        res.status(200).json({ message: "color status updated", data: color });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }


}

module.exports = {
    getAllColor,
    CreateColor,
    UpdateColor,
    DeleteColor,
    toggleColor
}