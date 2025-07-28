// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, fetchAllPayments, placeCodOrder } = require("../controllers/payments")

const {auth , isUser, isAdmin} = require("../middleware/auth")

router.post("/checkout", auth, isUser, capturePayment)  

router.post("/verifySignature"  ,auth ,isUser , verifyPayment);

router.post("/cod-order", auth,isUser, placeCodOrder );

router.get("/fetchAllPayments" ,auth , isAdmin , fetchAllPayments)

module.exports = router;    