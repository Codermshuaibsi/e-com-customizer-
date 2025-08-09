const Category = require("../models/productCategory");
const SubCategory = require("../models/productSubCategory");
const Product = require("../models/productModel");
const { uploadToCloudinary } = require("../utils/imageUploader");
const { ObjectId } = require("mongodb");

// !create sub category

exports.createSubCategory = async (req, res) => {
  try {
    const { title, categoryId } = req.body;

    const images = req.files.images;

    // validation
    if (!title || !images || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const categoryDetail = await Category.findById({ _id: categoryId });

    if (!categoryDetail) {
      return res.status(404).json({
        success: false,
        message: "Category do not found with this ID",
      });
    }

    const image = await uploadToCloudinary(
      images,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    // create entry in db of sub category
    const subCategoryDetails = await SubCategory.create({
      title,
      images: image.secure_url,
    });

    //  update in the category also
    await Category.findByIdAndUpdate(
      { _id: categoryId },
      {
        $push: {
          subCategory: subCategoryDetails._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Subcategory created successfully",
      subCategory: subCategoryDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error , in create Sub Category",
    });
  }
};
  
// ! show all sub category
exports.fetchAllSubCategoryOfCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(403).json({
        success: false,
        message: "Please send the category Id",
      });
    }

    const categoryDetails = await Category.findById({
      _id: categoryId,
    }).populate("subCategory");

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Cannot find the category with this id ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfuly fetch the subCategory",
      categoryDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error ",
    });
  }
};


// !sub category page details ->
exports.subCategoryPageDetails = async (req, res) => {
  try {
    // get category id
    const { subCategoryId } = req.params;

    // get courses for specified category id
    const selectedSubCategory = await SubCategory.findById({
      _id: subCategoryId,
    }).populate("products");

    // validation
    if (!selectedSubCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub categoy not found ",
      });
    }

    // ṛeturn
    return res.status(200).json({
      success: true,
      message: "successfuly fetch all sub category details ",

      selectedSubCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! delete category
exports.deleteSubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    console.log("id", subCategoryId);

    const subCategoryDetail = await SubCategory.findOne({ _id: subCategoryId });
    console.log("deta", subCategoryDetail);

    if (!subCategoryDetail) {
      return res.status(404).json({
        success: false,
        message: "category do not found with this ID",
      });
    }

    for (let index = 0; index < subCategoryDetail.products.length; index++) {
      const productId = subCategoryDetail.products[index];

      const productIdObjectId = new ObjectId(productId);

      await Product.findByIdAndDelete(
        { _id: productIdObjectId },
        { new: true }
      );
    }

    await SubCategory.findByIdAndDelete({ _id: subCategoryId }, { new: true });

    return res.status(200).json({
      success: true,
      message: "sub Category deleted successfuly",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error , delete sub category",
    });
  }
};

// ! update category
exports.updateSubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const { title } = req.body;

    const images = req.files?.images;

    if (!subCategoryId) {
      return res.status(403).json({
        success: false,
        message: "please send the cattegory Id",
      });
    }

    if (!title && !images) {
      return res.status(403).json({
        success: false,
        message: "no new update is done ",
      });
    }

    const subCategoryDetails = await SubCategory.findOne({
      _id: subCategoryId,
    });

    if (!subCategoryDetails) {
      return res.status(404).json({
        success: false,
        message: "no sub category found with this Id",
      });
    }

    if (title) {
      subCategoryDetails.title = title;
    }
    if (images) {
      const imageDetail = await uploadToCloudinary(
        images,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      subCategoryDetails.images = imageDetail.secure_url;
    }

    await subCategoryDetails.save();

    return res.status(200).json({
      success: true,
      message: "successfuly updated the sub category",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "update sub category intenal server error",
    });
  }
};



