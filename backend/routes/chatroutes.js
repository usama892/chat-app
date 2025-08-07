const express = require('express');
const router = express.Router();
const { getChatMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
router.get('/messages/:userId',authMiddleware, getChatMessages);
module.exports = router;
