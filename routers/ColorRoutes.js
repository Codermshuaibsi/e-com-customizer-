const express = require('express');
const { CreateColor, UpdateColor, DeleteColor, getAllColor } = require('../controllers/ColorControllers');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/create/color',auth, isAdmin,CreateColor);
router.put('/update/color',auth, isAdmin,UpdateColor)
router.delete('/delete/color',auth, isAdmin,DeleteColor);
router.get('/get/color',getAllColor);

module.exports = router