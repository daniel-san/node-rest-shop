const express = require('express');
const router = express.Router();

// Middlewares
const checkAuth = require('../middleware/check-auth');

// Controller
const UserController = require('../controllers/user');

// Routes
router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;