const Product = require("../models/productModel");
const { uploadToCloudinary } = require("../utils/imageUploader");
const SubCategory = require("../models/productSubCategory");

// create product
exports.createProduct = async (req, res) => {
  try {

    const { title, description, price, quantity, color, subCategoryId, brand, variant } = req.body;
    // Expecting images to be uploaded as req.files.images (array of files)
    // Fallback: if only one image, it may not be an array
    let images = req.files?.images;
    if (!Array.isArray(images) && images) {
      images = [images];
    }
    const userId = req.user.id;

    if (!title || !description || !price || !images || images.length < 3 || !subCategoryId || !quantity || !color || !brand || !variant) {
      return res.status(403).json({
        success: false,
        message: "All fields are required and at least 3 images (front, back, side) must be uploaded.",
      });
    }


    //   see the category is valid or not
    const subCategoryDetails = await SubCategory.findOne({
      _id: subCategoryId,
    });

    if (!subCategoryDetails) {
      return res.status(404).json({
        success: false,
        message: "sub category details not found ",
      });
    }

    // upload all images to cloudinary
    const uploadedImages = [];
    for (const img of images) {
      const uploaded = await uploadToCloudinary(
        img,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      if (uploaded && uploaded.secure_url) {
        uploadedImages.push(uploaded.secure_url);
      }
    }

    if (uploadedImages.length < 3) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload all images. Please try again.",
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      images: uploadedImages, // store all image URLs
      thumbnail: uploadedImages[0], // use first image as thumbnail
      postedBy: userId,
      subCategory: subCategoryDetails._id,
      quantity,
      color,
      brand,
      variant,
    });

    // add course entry in Category => because us Category ke inside sare course aa jaye
    await SubCategory.findByIdAndUpdate(
      { _id: subCategoryDetails._id },
      {
        $push: {
          products: product._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "successfuly created the product ",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error in creating product",
    });
  }
};

// update produc
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, color } = req.body;

    const thumbnail = req.files?.thumbnail;

    const { productId } = req.params;

    if (!title || !description || !price || !thumbnail || !quantity || !color) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    if (!productId) {
      return res.status(403).json({
        success: false,
        message: "please send the product ID",
      });
    }

    //   check product id exist or not
    const productDetails = await Product.findById({ _id: productId });

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "product do not exist with this product ID",
      });
    }

    //   product ID is valid
    if (title) {
      productDetails.title = title;
    }

    if (description) {
      productDetails.description = description;
    }

    if (price) {
      productDetails.price = price;
    }
    if (quantity) {
      productDetails.quantity = quantity;
    }
    if (color) {
      productDetails.color = color;
    }

    if (thumbnail) {
      // upload to cloudinary
      const image = await uploadToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      productDetails.thumbnail = image.secure_url;
    }

    await productDetails.save();

    return res.status(200).json({
      success: true,
      message: "Product details update successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error in updating product",
    });
  }
};

// delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productID } = req.params;

    if (!productID) {
      return res.status(403).json({
        success: false,
        message: "please send product ID",
      });
    }

    // delete the product from the sub Category
    const productDetails = await Product.findById({ _id: productID });

    // REMOVE THE ITEM FROM CATEGORY
    const subCategoryId = productDetails.subCategory;

    await SubCategory.findByIdAndUpdate(
      { _id: subCategoryId },
      { $pull: { products: productID } }
    );

    // delete the product
    await Product.findByIdAndDelete({ _id: productID });

    return res.status(200).json({
      success: true,
      message: "product deleted successfully ",
      productDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Delete product unsuccessfull , please try againb",
    });
  }
};

// fetch all products
exports.fetchAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});

    return res.status(200).json({
      success: true,
      message: "successfuly all products",
      Total: allProducts.length,
      allProducts
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error in fetch all products ",
    });
  }
};

// get product by id
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(403).json({
        success: false,
        message: "please send the product Id ",
      });
    }

    const productDetails = await Product.findOne({ _id: productId });

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "no product found with this id ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "successfuly fetch the product Details",
      data: productDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error in get product by id",
    });
  }
};

exports.totalProduct = async (req, res) => {
  try {
    const AllProduct = await Product.find({}).populate('brand').populate('subCategory').populate('variant');

    return res.status(200).json({
      success: true,
      AllProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error ",
    });
  }
};

exports.productQuantity = async (req, res) => {
  try {
    const { change } = req.body;
    console.log("cange");

    const { productId } = req.params;

    console.log("id", productId);

    const ProductDetail = await Product.findById(productId);
    console.log("ProductDetail", ProductDetail);

    if (change === "increment") {
      ProductDetail.quantity += 1;
    } else if (change === "decrement") {
      if (ProductDetail.quantity > 0) {
        ProductDetail.quantity -= 1;
      }
    }

    await ProductDetail.save();

    return res.status(200).json({
      success: true,
      message: "Succesfuly done",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "search query is required"
      })
    }
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "product not founds"
      })
    }
    return res.status(200).json({
      success: true,
      message: "product search successfully",
      data: products
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "error in search product api",
      error
    })
  }
} 
