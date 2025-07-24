const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Coupon = require("../models/cuponModel");
const Category = require("../models/productCategory");
const SubCategory = require("../models/productSubCategory");


exports.getAdminDashboardStats = async (req, res) => {
   try {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });
      const totalUsers = await User.countDocuments()
      const totalProducts = await Product.countDocuments()
      const totalCategories = await Category.countDocuments()
      const totalSubCategories = await SubCategory.countDocuments() 
      const totalCoupons = await Coupon.countDocuments()
      const totalOrders = await Order.countDocuments()
      const deliveredOrders = await Order.find({ orderStatus: "Delivered" });
      const deliveryorders = deliveredOrders.length;
      const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" })
      const processingOrders = await Order.countDocuments({ orderStatus: "Processing" })
      const shippedOrders = await Order.countDocuments({ orderStatus: "Shipped" })
      const CancelOrders = await Order.countDocuments({orderStatus:"Cancelled"})
      const activeCoupons = await Coupon.countDocuments({ isActive: true })
      const products = await Product.find();



      const totalWishlistCount = products.reduce((sum, product) => {
         return sum + (product.wishlist ? product.wishlist.length : 0);
      }, 0);

      const totalRevenue = deliveredOrders.reduce(
         (sum, order) => sum + order.totalAmount, 0
      );

      return res.status(200).json({
         success: true,
         message: "Admin dashboard data fetched successfully",
         data: {
            newUsersThisMonth,
            totalUsers,
            totalCategories,
            totalProducts,
            totalSubCategories,
            totalOrders,
            totalCoupons,
            deliveryorders,
            pendingOrders,
            CancelOrders,
            activeCoupons,
            processingOrders,
            shippedOrders,
            totalRevenue,
            totalWishlistCount,
         }
      })
   } catch (error) {
      console.error("Dashboard error:", error);
      return res.status(500).json({
         success: false,
         message: "Failed to fetch admin dashboard data",
      });
   }
} 