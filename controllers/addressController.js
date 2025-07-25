const ShippingAddress = require("../models/ShippingAddress ");

// ✅ Create New Address
exports.createAddress = async (req, res) => {
  try {
    const {
    
       fullName,
      phone,
      address,
      landmark,
      city,
      state,
      pincode,
      country,
      type,
    } = req.body;
     const userId = req.user.id;

    // Simple validation (you can add more)
    if ( !fullName|| !phone || !address || !city || !state || !pincode || !country) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Simple validation (you can add more)
    if (!userId ) {
      return res.status(400).json({
        success: false,
        message: "Please token required .",
      });
    }


    const newAddress = new ShippingAddress({
      
      
     userId, // ✅ was missing
      fullName, // ✅ was missing
      phone,
      address,
      landmark,
      city,
      state,
      pincode,
      country,
      type: type || "Home",
    });

    const savedAddress = await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: savedAddress,
    });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving address",
      error: error.message,
    });
  }
};

// ✅ Get All Addresses by User ID
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login to fetch addresses.",
      });
    }

    const addresses = await ShippingAddress.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching addresses",
      error: error.message,
    });
  }
};



// ✅ Get Single Address by ID
exports.getSingleAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await ShippingAddress.findById(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching address",
      error: error.message,
    });
  }
};


// ✅ Update Address by ID
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAddress = await ShippingAddress.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating address",
      error: error.message,
    });
  }
};

// ✅ Delete Address by ID
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAddress = await ShippingAddress.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting address",
      error: error.message,
    });
  }
};
