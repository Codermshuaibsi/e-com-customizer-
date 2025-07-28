const Product = require("../models/productModel");
// const User = require("../models/userModel")


// add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const userId = req.user.id;
     
    console.log(productId,userId);
    
    if (!productId || !userId) {
      return res.status(403).json({
        success: false,
        message: "please send the productId",
      });
    }

    // check valid product ID or not
    const productDetails = await Product.findById(productId);
    console.log(productDetails)

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "The product do not exist with this id ",
      });
    }

       // Check if the product is in stock
       if (productDetails.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock",
        });
      }
  
      // Add user to the cart array and decrease product quantity
      productDetails.cart.push(userId);
      productDetails.quantity -= 1; // Reduce stock by 1
      await productDetails.save();

    // await productDetails.cart.push(userId);
    // await productDetails.save();

    res.status(200).json({
      success:true , 
      message: "Product added to cart successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      success: false,
      message: "error in add to cart",
    });
  }
};  

// remove from cart

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const userId = req.user.id;

    if (!productId || !userId) {
      return res.status(403).json({
        success: false,
        message: "please send the productId",
      });
    }

    // check valid product ID or not
    const productDetails = await Product.findById(productId);

    

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "The product do not exist with this id ",
      });
    }

    const indexToRemove = productDetails.cart ? productDetails.cart.indexOf(userId) : -1;

    if (indexToRemove !== -1) {
      productDetails.cart.splice(indexToRemove, 1);
      await productDetails.save();
      res.status(200).json({ message: "Product removed from cart successfully"  , success:true});

    } else {
      res.status(404).json({ error: "User not found in the product's cart" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in remove cart , internal server error ",
    });
  }
};


exports.removeAllFromCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Find all products that belong to the user's cart
    const productsInCart = await Product.find({ cart: userId });
 
    
    if (!productsInCart || productsInCart.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Your cart is empty. No products to remove.",
      });
    }

    // Remove the userId from the cart of each product
    for (let product of productsInCart) {
      const indexToRemove = product.cart.indexOf(userId);
      if (indexToRemove !== -1) {
        product.cart.splice(indexToRemove, 1);
        await product.save();
      }
    }

    // Return success message after all items are removed
    res.status(200).json({
      success: true,
      message: "All items removed from the cart successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while removing items from cart.",
    });
  }
};

// fetch all cart of login user
// exports.fetchAllCartItem = async (req, res) => {
//   try {
//     const userId = req.params.id || req.user.id;
//     console.log(userId) 

//     if (!userId) {
//       return res.status(403).json({
//         success: false,
//         message: "please send the userId",
//       });
//     }

//     const cartItems = await Product.find({ cart: userId });
    

//     res.status(200).json({success:true ,
//       message:"successfuly fetch the all cart item of user " });
//       cartItems 
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error in fetch all cart items " });
//   }
// };

 
exports.fetchAllCartItem = async (req, res) => {
  try {
    // const userId = req.params.id || req.user?.id;
    const userId = req.user?.id || req.params.id || req.query.userId;
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "User ID is missing",
      });
    }

    const cartItems = await Product.find({ cart: userId });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched all cart items of the user",
      cartItems, 
    });
  } catch (error) {
    console.error("Cart fetch error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in fetch all cart items",
    });
  }
};

