// Import the required modules
const express = require("express");
const router = express.Router();

// Import controllers
const {
    fetchAllCartItem, addToCart, removeFromCart, removeAllFromCart, updateCartQuantity
} = require("../controllers/cartController");

const {
    addToWishlist, removeFromWishlist, fetchAllWishlistItem, removeAllWislist,
} = require("../controllers/wishlistController");

const { auth, isUser, isAdmin } = require("../middleware/auth");

// ********************************************************************************************************
//                                      Cart Routes
// ********************************************************************************************************

// ✅ User-only access (must be logged in)
router.get("/fetchAllCartItems", auth, isUser, fetchAllCartItem);

router.get("/AllCartItems/:id", auth, isUser, fetchAllCartItem);  // ✅ Only allow if user owns the cart or if admin

router.post("/addToCart/:productId", auth, isUser, addToCart);

router.post("/removeFromCart/:productId", auth, isUser, removeFromCart);

router.post("/removeAllFromCart", auth, isUser, removeAllFromCart);

router.put("/updateCartQuantity/:productId", auth, isUser, updateCartQuantity);

// ********************************************************************************************************
//                                      Wishlist Routes
// ********************************************************************************************************

router.post("/addToWishlist/:productId", auth, isUser, addToWishlist);

router.delete("/removeFromWishlist/:productId", auth, isUser, removeFromWishlist);

router.get("/fetchAllWishlistItem", auth, isUser, fetchAllWishlistItem);

router.delete("/removeAllWislist", auth, isUser, removeAllWislist);

module.exports = router;
