const express = require('express');
const router = require('express').Router();
const userController = require('../controllers/userController');
const {identifier} = require('../middlewares/identification');

router.get('/me', identifier, userController.getMe);
router.get('/all-users', identifier, userController.getAllUsers);
router.get('/user-by-email',identifier, userController.getUserByEmail);
router.get('/user-by-role', identifier, userController.getUserByRole);
router.get('/user-by-id', identifier, userController.getUserById);

router.delete('/delete-user', identifier, userController.deleteUser);
router.put('/update-user',identifier, userController.updateUser);
module.exports = router;