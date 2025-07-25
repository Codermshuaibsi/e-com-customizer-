
const { uploadToCloudinary } = require("../utils/imageUploader");

const Brand = require("../models/BrandModel");
// Create Brand
exports.createBrand = async (req, res) => {
    try {
        const { name, metaTitle, metaDescription, keywords } = req.body;

        const thumbnail = req.files.thumbnail;

        if (!name || !metaTitle || !metaDescription || !keywords || !thumbnail) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Upload image to Cloudinary
        const image = await uploadToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME,
            1000,
            1000
        ); 


        const newBrand = new Brand({
            name,
            logoUrl: image.secure_url,
            seo: {
                metaTitle,
                metaDescription,
                keywords: keywords?.split(",") || [],
            },
        });

        const savedBrand = await newBrand.save();
        res.status(201).json(savedBrand);
    } catch (error) {
        res.status(500).json({ message: "Failed to create brand", error });
    }
};

// Get All Brands
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch brands", error });
    }
};

// Get Single Brand
exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ message: "Brand not found" });
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch brand", error });
    }
};

// Update Brandzx   x   
exports.updateBrand = async (req, res) => {
    try {
        const { name, metaTitle, metaDescription, keywords, active } = req.body;
        const thumbnail = req.files.thumbnail;
        if (!name || !metaTitle || !metaDescription || !keywords || !thumbnail) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const image = await uploadToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        let updatedData = {
            name,
            active,
            logoUrl: image?.secure_url,
            seo: {
                metaTitle,
                metaDescription,
                keywords: keywords?.split(",") || [],
            },
        };

        const updatedBrand = await Brand.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.status(200).json(updatedBrand);
    } catch (error) {
        res.status(500).json({ message: "Failed to update brand", error });
    }
};

// Delete Brand
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(404).json({ message: "Brand not found" });
        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete brand", error });
    }
};

// Toggle Brand Active Status
exports.updateToggleBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ message: "Brand not found" });

        brand.active = !brand.active;
        const updatedBrand = await brand.save();

        res.status(200).json({
            message: "Brand status updated",
            data: updatedBrand,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update brand status", error });
    }
}