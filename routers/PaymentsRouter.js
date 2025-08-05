// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, fetchAllPayments, placeCodOrder } = require("../controllers/payments")

const {auth , isUser, isAdmin} = require("../middleware/auth")

router.post("/checkout", auth, capturePayment)  

router.post("/verifySignature"  ,auth  , verifyPayment);

router.post("/cod-order", auth, placeCodOrder );

router.get("/fetchAllPayments" ,auth , isAdmin , fetchAllPayments)

module.exports = router;    