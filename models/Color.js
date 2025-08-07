const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
    colorname: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    active: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Color", ColorSchema)