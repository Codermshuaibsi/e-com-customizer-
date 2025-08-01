const express = require('express');
const { CreateColor, UpdateColor, DeleteColor, getAllColor } = require('../controllers/ColorControllers');

const router = express.Router();

router.post('/create/color',CreateColor);
router.put('/update/color',UpdateColor)
router.delete('/delete/color',DeleteColor);
router.get('/get/color',getAllColor);

module.exports = router