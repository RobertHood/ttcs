const express = require('express');
const authController = require('../controllers/authController');
const { verifyUser, verifyAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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
router.post('/logout', verifyUser, authController.logout);

router.patch('/send-verification-code',verifyUser, authController.sendVerificationCode);
router.patch('/verify-code',verifyUser, authController.verifyVerificationCode);
router.patch('/change-password',verifyUser, authController.changePassword);
router.patch('/send-forgot-password-code', authController.sendForgotPasswordCode);
router.patch('/verify-forgot-password-code', authController.verifyForgotPasswordCode);

router.delete('/delete-user',  authController.deleteUser);
router.get('/profile', verifyUser, authController.getProfile);
router.patch('/profile/update', verifyUser, authController.updateProfile);
router.get('/login-activity', verifyUser, authController.getLoginActivity);

router.post('/profile/avatar', verifyUser, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
  const url = `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`;
  res.json({ status: 'success', url });
});

module.exports = router;