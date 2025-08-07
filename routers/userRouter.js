const express = require("express");
const router = express.Router();

const {
  login,
  signUp,
  updateUser,
  getUserDetails,
  deleteUser,
  adminLogin,
  getAllUsers,
  getAllAdmins,
  getAdminById,
  updateAddress,
  sendConnectMail,
  LoginWithGoogle,
  lostPasswordController,
  updateprofile,
  changePassword
} = require("../controllers/userController");

const { auth, isAdmin, isUser } = require("../middleware/auth");

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Public Routes
router.post("/login", login); 
router.post("/adminLogin", adminLogin);
router.post("/signup", signUp);
router.post("/LoginWithGoogle", LoginWithGoogle);
router.post("/sendMail", sendConnectMail);
router.post("/lostPassword", lostPasswordController);

// Admin Only Routes
router.get("/getAllUsers", auth, isAdmin, getAllUsers);
router.get("/getAllAdmin", auth, isAdmin, getAllAdmins);
router.get("/getAdminById/:id", auth, isAdmin, getAdminById);
router.put("/updateDetails/:id", auth, isAdmin, updateUser);
router.delete("/deleteUser/:id", auth, isAdmin, deleteUser);

// User Routes (Must be authenticated as user)
router.put("/updateDetails", auth, isUser, updateUser);
router.put("/updateAddress", auth, isUser, updateAddress);
router.delete("/deleteUser", auth, isUser, deleteUser);
router.get("/getUserDetail", auth, isUser, getUserDetails);
router.get("/getUser", auth, isUser, getUserDetails);
router.put("/change-password", auth, isUser, changePassword);

// Mixed Role Access (Authenticated user or admin updating their own profile)
router.put("/updateprofile/:id", auth, updateprofile);

module.exports = router;
