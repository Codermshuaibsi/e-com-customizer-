// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
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

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login); 

router.post("/adminLogin", adminLogin);

// Route for user signup
router.post("/signup", signUp);

router.post("/LoginWithGoogle", LoginWithGoogle)

router.get("/getAllUsers", auth, isAdmin, getAllUsers);

router.get("/getAllAdmin", auth, isAdmin, getAllAdmins)

router.get("/getAdminById/:id", auth, isAdmin, getAdminById)

router.put("/updateprofile/:id",auth ,updateprofile)

 router.put("/updateDetails", auth, updateUser);

router.put("/updateDetails/:id", auth, updateUser);


router.put("/updateAddress", auth, updateAddress);

router.delete("/deleteUser", auth, deleteUser); 

router.delete("/deleteUser/:id", auth, deleteUser);


router.get("/getUserDetail", auth, getUserDetails);

router.get("/getUser",auth, getUserDetails);

router.post("/sendMail", sendConnectMail);

router.post("/lostPassword", lostPasswordController)

router.put("/change-password", auth, changePassword);


module.exports = router;
