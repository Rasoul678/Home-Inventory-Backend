const express = require('express');
const AuthController = require('./authController');

const router = express.Router();


router.post('/signup', AuthController.signup);

router.post('/signin', AuthController.signin);

router.post('/refresh_token', AuthController.refreshToken);

router.delete('/signout', AuthController.signout);

module.exports = router;