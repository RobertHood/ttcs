const express = require('express');
const authController = require('../controllers/authController');
const { identifier } = require('../middlewares/identification');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer config for avatar upload
const avatarDir = path.join(__dirname, '../public/avatars');
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const upload = multer({ storage });

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', identifier, authController.logout);

router.patch('/send-verification-code',identifier, authController.sendVerificationCode);
router.patch('/verify-code',identifier, authController.verifyVerificationCode);
router.patch('/change-password',identifier, authController.changePassword);
router.patch('/send-forgot-password-code', authController.sendForgotPasswordCode);
router.patch('/verify-forgot-password-code', authController.verifyForgotPasswordCode);

router.delete('/delete-user',  authController.deleteUser);

router.get('/profile', identifier, authController.getProfile);
router.patch('/profile/update', identifier, authController.updateProfile);

router.post('/profile/avatar', identifier, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
  const url = `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`;
  res.json({ status: 'success', url });
});

module.exports = router;