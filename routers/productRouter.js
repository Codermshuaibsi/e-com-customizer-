// Import the required modules
const express = require("express");
const router = express.Router();

const { auth, isAdmin, isUser } = require("../middleware/auth");


// Import the required controllers and middleware functions
const {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllProducts,
  getProductById,
  totalProduct,
  productQuantity,
  searchProduct
} = require("../controllers/productController");


const {
  createCategory,
  showAllCategory,
  deleteCategory,
  updateCategory,
  fetchCategoryPageDetail,
  getProductsByCategoryId,
} = require("../controllers/Category");

const {
  createSubCategory,
  fetchAllSubCategoryOfCategory,
  subCategoryPageDetails,
  deleteSubCategory,
  updateSubCategory,
} = require("../controllers/SubCategory");



// ********************************************************************************************************
//                                      product routes
// ********************************************************************************************************

router.post("/createProduct", auth, isAdmin, createProduct);

router.put("/updateProduct/:productId", auth, isAdmin, updateProduct);

router.get("/totalProduct", totalProduct);

router.delete("/deleteProduct/:productID", auth, isAdmin, deleteProduct);

router.get("/getProductById/:productId", getProductById);

router.get("/fetchAllProducts", fetchAllProducts);

router.post("/productQuantity/:productId", auth, isUser, productQuantity);

router.get("/search/product", searchProduct)

// ********************************************************************************************************
//                                      product routes by using category
// ********************************************************************************************************

router.post("/createCategory", auth, isAdmin, createCategory);

router.delete("/deleteCategory/:categoryId", auth, isAdmin, deleteCategory);

router.get("/showAllCategory", showAllCategory);

router.get("/categoryPageDetails/:categoryId", fetchCategoryPageDetail);

router.put("/updateCategory/:categoryId", auth, isAdmin, updateCategory);

router.get("/getProductsByCategoryId/:categoryId", getProductsByCategoryId);

// ********************************************************************************************************
//                                      product routes by using sub category
// ********************************************************************************************************

router.post("/createSubCategory", auth, isAdmin, createSubCategory);

router.get("/fetchAllSubCategoryOfCategory/:categoryId", fetchAllSubCategoryOfCategory);

router.get("/subCategoryPageDetails/:subCategoryId", subCategoryPageDetails);

router.delete("/deleteSubCategory/:subCategoryId", auth, isAdmin, deleteSubCategory);

router.put("/updateSubCategory/:subCategoryId", auth, isAdmin, updateSubCategory);





module.exports = router;
