const express = require("express");
const { auth, isAdmin, isUser } = require("../middleware/auth");
const router = express.Router();
const {
  createAddress,
  getAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

// ✅ Create a new address
router.post("/createAddress",auth,isUser, createAddress);

// ✅ Get all addresses of a user (pass userId as query param)
router.get("/getAllAddresses",auth ,isUser , getAddresses);

// ✅ Get a single address by address ID
router.get("/getSingleAddress/:id",auth ,isUser, getSingleAddress);

// ✅ Update address by address ID
router.put("/updateAddress/:id",auth ,isUser , updateAddress);

// ✅ Delete address by address ID
router.delete("/deleteAddress/:id" ,auth ,isUser ,deleteAddress);

module.exports = router;
