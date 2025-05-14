const express = require('express');
const authController = require('../controllers/authController');
const { identifier } = require('../middlewares/identification');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', identifier, authController.logout);

router.patch('/send-verification-code',identifier, authController.sendVerificationCode);
router.patch('/verify-code',identifier, authController.verifyVerificationCode);
router.patch('/change-password',identifier, authController.changePassword);
router.patch('/send-forgot-password-code', authController.sendForgotPasswordCode);
router.patch('/verify-forgot-password-code', authController.verifyForgotPasswordCode);

router.delete('/delete-user',  authController.deleteUser);

module.exports = router;