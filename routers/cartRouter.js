// Import the required modules
const express = require("express")
const router = express.Router();

// Import the required controllers and middleware functions
const {
    fetchAllCartItem, addToCart, removeFromCart, removeAllFromCart, updateCartQuantity
} = require("../controllers/cartController");


const { addToWishlist, removeFromWishlist, fetchAllWishlistItem, removeAllWislist, } = require("../controllers/wishlistController");

const { auth, isUser } = require("../middleware/auth");

// ********************************************************************************************************
//                                      cart routes
// ********************************************************************************************************
// ********************************************************************************************************
//                                      cart routes
// ********************************************************************************************************

router.get("/fetchAllCartItems", auth, fetchAllCartItem); // ✅ Needs user context

router.get("/AllCartItems/:id", auth, fetchAllCartItem);  // ✅ If you use params, still protect it

router.post("/addToCart/:productId", auth, addToCart); // ✅ Critical

router.post("/removeFromCart/:productId", auth, removeFromCart);

router.post("/removeAllFromCart", auth, removeAllFromCart);

router.put("/updateCartQuantity/:productId", auth, updateCartQuantity);


// ***************************************************************************************
//                                     wishlist routes
//***************************************************************************************

// ***************************************************************************************
//                                     wishlist routes
// ***************************************************************************************

router.post("/addToWishlist/:productId", auth, addToWishlist);

router.delete("/removeFromWishlist/:productId", auth, removeFromWishlist);

router.get("/fetchAllWishlistItem", auth, fetchAllWishlistItem);

router.delete("/removeAllWislist", auth, removeAllWislist);


module.exports = router;  