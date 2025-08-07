const express = require('express');
const router = express.Router();
const { register, login, dashboard,getAllUsersExceptMe } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/dashboard', authMiddleware, dashboard);
router.get('/users', authMiddleware, getAllUsersExceptMe);

module.exports = router;
