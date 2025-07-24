const Cupon = require("../models/cuponModel");


exports.addCupon = async (req, res) => {
    try {
        const { title, discount, validity, code } = req.body;
        if (!title||!discount || !validity || !code) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const cupon = await Cupon.create({
            title,
            discount,
            validity,
            code,
        });
        return res.status(200).json({
            success: true,
            data: cupon,
            message: "Coupon created successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllCupons = async (req, res) => {
    try {
        const cupons = await Cupon.find();
        return res.status(200).json({
            success: true,
            data: cupons,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getSingleCupon = async (req, res) => {
    try {
        const cupon = await Cupon.findById(req.params.id);
        if (!cupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: cupon,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateCupon = async (req, res) => {
    try {
        const { discount, validity, code } = req.body;
        const cupon = await Cupon.findByIdAndUpdate(
            req.params.id,
            { discount, validity, code },
            { new: true }
        );
        if (!cupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: cupon,
            message: "Coupon updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteCupon = async (req, res) => {
    try {
        const cupon = await Cupon.findByIdAndDelete(req.params.id);
        if (!cupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        // Attempt to delete all coupons
        const result = await Cupon.deleteMany({});
        
        // Check if any coupons were deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No coupons found to delete",
            });
        }
        // Successfully deleted all coupons
        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} coupons deleted successfully`,
        });
    } catch (error) {
        // Handle any errors that occur during the delete operation
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}; 

exports.applyCupon = async (req, res) => {
  try {
    const { userId, couponId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userCart = await Product.find({ cart: userId });

    let cartTotal = 0;
    userCart.forEach(product => {
      cartTotal += product.price * product.quantity; 
    });

    if (!couponId) {
      return res.status(200).json({
        message: "No coupon applied, returning total cart value.",
        cartTotal,
      });
    }

    const coupon = await Cupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const discount = (cartTotal * coupon.discount) / 100; 

    const finalTotal = cartTotal - discount;

    res.status(200).json({
      message: "Coupon successfully applied to the cart total.",
      coupon,
      cartTotal: finalTotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};