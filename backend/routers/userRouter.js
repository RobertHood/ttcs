const express = require('express');
const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyUser, verifyAdmin } = require('../middlewares/authMiddleware');

router.get('/me', verifyUser, userController.getMe);
router.get('/all-users', verifyUser, userController.getAllUsers);
router.get('/user-by-email',verifyUser, userController.getUserByEmail);
router.get('/user-by-role', verifyUser, userController.getUserByRole);
router.get('/user-by-id', verifyUser, userController.getUserById);

router.delete('/delete-user', verifyUser, userController.deleteUser);
router.put('/update-user',verifyUser, userController.updateUser);
module.exports = router;