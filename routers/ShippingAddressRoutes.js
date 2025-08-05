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
router.post("/createAddress",auth, createAddress);

// ✅ Get all addresses of a user (pass userId as query param)
router.get("/getAllAddresses",auth , getAddresses);

// ✅ Get a single address by address ID
router.get("/getSingleAddress/:id",auth , getSingleAddress);

// ✅ Update address by address ID
router.put("/updateAddress/:id",auth  , updateAddress);

// ✅ Delete address by address ID
router.delete("/deleteAddress/:id" ,auth  ,deleteAddress);

module.exports = router;
