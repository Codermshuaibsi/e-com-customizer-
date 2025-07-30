const Product = require("../models/productModel");
// const User = require("../models/userModel")


// add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId || !userId) {
      return res.status(403).json({
        success: false,
        message: "Please provide productId and userId",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} items left in stock`,
      });
    }

    // Check if user already added to cart
    const existingItem = product.cart.find(
      (item) => item.userId.toString() === userId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      product.cart.push({ userId, quantity });
    }

    product.quantity -= quantity;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding to cart",
    });
  }
};


// remove from cart

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const itemIndex = product.cart.findIndex(
      (item) => item.userId.toString() === userId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in your cart",
      });
    }

    const removedItem = product.cart[itemIndex];
    product.quantity += removedItem.quantity;

    product.cart.splice(itemIndex, 1);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    console.error("Remove from cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while removing from cart",
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
    const userId = req.user?.id || req.params.id || req.query.userId;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "User ID is missing",
      });
    }

    const products = await Product.find({
      "cart.userId": userId,
    });

    const cartItems = products.map((product) => {
      const userCartEntry = product.cart.find(
        (item) => item.userId.toString() === userId
      );
      return {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: userCartEntry.quantity,
        thumbnail: product.thumbnail,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      cartItems,
    });
  } catch (error) {
    console.error("Fetch cart error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in fetch all cart items",
    });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!productId || !userId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide productId, userId, and quantity",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const cartItem = product.cart.find(
      (item) => item.userId.toString() === userId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in your cart",
      });
    }

    if (quantity < 1 || quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be between 1 and ${product.quantity}`,
      });
    }

    cartItem.quantity = quantity;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
    });
  } catch (error) {
    console.error("Update cart quantity error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating cart quantity",
    });
  }
};