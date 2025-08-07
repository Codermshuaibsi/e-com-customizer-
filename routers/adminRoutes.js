const express = require("express")
const router = express.Router()
const { getAdminDashboardStats } = require("../controllers/adminController")

const { auth, isAdmin } = require("../middleware/auth")

router.get("/dashboard", isAdmin, getAdminDashboardStats)

module.exports = router;  


