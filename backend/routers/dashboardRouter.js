const express = require('express');
const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const { identifier } = require('../middlewares/identification');

router.get('/stats', identifier, dashboardController.getStats);

module.exports = router; 