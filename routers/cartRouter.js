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

router.get("/fetchAllCartItems", fetchAllCartItem)

router.get("/AllCartItems/:id", fetchAllCartItem)

router.post("/addToCart/:productId", addToCart)

router.post('/removeFromCart/:productId',  removeFromCart);

router.post('/removeAllFromCart',  removeAllFromCart);

router.put('/updateCartQuantity/:productId',  updateCartQuantity);


// ***************************************************************************************
//                                     wishlist routes
//***************************************************************************************

router.post('/addToWishlist/:productId',  addToWishlist);

router.delete("/removeFromWishlist/:productId",  removeFromWishlist);

router.get("/fetchAllWishlistItem", fetchAllWishlistItem);

router.delete("/removeAllWislist",  removeAllWislist);


module.exports = router;  