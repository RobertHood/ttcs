const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyUser, verifyAdmin } = require('../middlewares/authMiddleware');

router.get('/', categoryController.getAllCategories);

router.post('/', verifyUser, verifyAdmin, categoryController.createCategory);

router.put('/:id', verifyUser, verifyAdmin, categoryController.updateCategory);

router.delete('/:id', verifyUser, verifyAdmin, categoryController.deleteCategory);

module.exports = router; 