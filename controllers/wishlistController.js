const User = require("../models/userModel");
const Product = require("../models/productModel")


exports.addToWishlist = async (req, res) => {
  try {

    const userId = req.user.id;

    const { productId } = req.params;

    if (!productId) {
      return res.status(403).json({
        success: false,
        message: "Please send the required data"
      })
    }


    const productDetails = await Product.findById(productId);

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "Please send the valid product ID"
      })
    }

    await productDetails.wishlist.push(userId);
    await productDetails.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in add to wishlist "
    })
  }
}


// remove from wishlist
// exports.removeFromWishlist = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const userId = req.user.id;

//     if (!productId || !userId) {
//       return res.status(403).json({
//         success: false,
//         message: "please send the productId",
//       });
//     }

//     // check valid product ID or not
//     const productDetails = await Product.findById(productId);


//     if (!productDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "The product do not exist with this id ",
//       });
//     }

//     const indexToRemove = productDetails.wishlist ? productDetails.wishlist.indexOf(userId) : -1;

//     if (indexToRemove !== -1) {
//       productDetails.wishlist.splice(indexToRemove, 1);
//       await productDetails.save();
//       res.status(200).json({ message: "Product removed from wishlist successfully" });

//     } else {
//       res.status(404).json({ error: "User not found in the product's cart" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "error in remove wishlist , internal server error ",
//     });
//   }
// };


// fetch all wishlist of login user  
exports.fetchAllWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "please send the userId",
      });
    }

    const wishlistItem = await Product.find({ wishlist: userId });

    res.status(200).json({ wishlistItem });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error in fetch all wishlist items " });
  }
};


exports.removeAllWislist = async (req, res) => {
  try {

    const userId = req.user.id;

    const products = await Product.find({ wishlist: userId });

    // Iterating through each product and remove the user from the wishlist
    const updatePromises = products.map(async (product) => {
      product.wishlist = product.wishlist.filter(
        (wishlistUserId) => wishlistUserId.toString() !== userId.toString()
      );
      await product.save();
    });


    await Promise.all(updatePromises);

    await User.updateOne({ _id: userId }, { $set: { wishlist: [] } });
    return res.status(200).json({
      success: true,
      message: "wishlist remove all successfully"
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in remove from all wishlist "
    })
  }
}


exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    console.log(userId)
     
    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Product ID and user ID are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const beforeLength = product.wishlist.length;

    product.wishlist = product.wishlist.filter(
      (id) => id.toString() !== userId.toString()
    );

    if (product.wishlist.length === beforeLength) {
      return res.status(404).json({
        success: false,
        message: "User was not in the wishlist",
      });
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      data: product,
    });
  } catch (error) {
    console.error("removeFromWishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};






  