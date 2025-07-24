const mongoose = require("mongoose");
const cuponSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    discount: { 
        type: Number,
        required: true,
    },
    validity: {
        type: Number,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    isActive:{
        type:Boolean,
        default:true,
    }
}, { timestamps: true });
module.exports = mongoose.model("Cupon", cuponSchema);