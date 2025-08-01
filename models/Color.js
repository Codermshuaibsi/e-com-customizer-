const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
    colorname: {
        type: String,
        required: true,
        unique: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("Color", ColorSchema)