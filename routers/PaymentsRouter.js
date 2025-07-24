// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, fetchAllPayments } = require("../controllers/payments")

const {auth , isUser, isAdmin} = require("../middleware/auth")

router.post("/checkout", auth, isUser, capturePayment)  

router.post("/verifySignature"  ,auth ,isUser , verifyPayment);

router.get("/fetchAllPayments" ,auth , isAdmin , fetchAllPayments)

module.exports = router;    