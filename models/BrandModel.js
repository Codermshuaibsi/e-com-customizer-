const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    logoUrl: {
        type: String, // Cloudinary image URL
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    seo: {
        metaTitle: {
            type: String,
            default: ""
        },
        metaDescription: {
            type: String,
            default: ""
        },
        keywords: {
            type: [String],
            default: []
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("Brand", brandSchema);
