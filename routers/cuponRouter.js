const express = require("express");
const router = express.Router();
const { addCupon, getAllCupons, deleteAll, getSingleCupon, updateCupon, deleteCupon,applyCupon } = require("../controllers/cuponController");
const { auth, isUser, isAuth, isAdmin } = require("../middleware/auth")  



router.post("/addCupon", auth, isAdmin, addCupon);  
router.post("/apply-coupon", auth, applyCupon)
router.get("/getCupons", auth, getAllCupons);
router.get("/getCupon/:id", auth, getSingleCupon);
router.put("/updateCupon/:id", auth, isAdmin, updateCupon);
router.delete("/deleteCupon/:id", auth, isAdmin, deleteCupon);
router.delete("/deleteCupon", auth, isAdmin, deleteAll);



module.exports = router;
