const express = require('express');
const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyUser, verifyAdmin } = require('../middlewares/authMiddleware');
router.get('/stats', verifyUser, dashboardController.getStats);

module.exports = router; 