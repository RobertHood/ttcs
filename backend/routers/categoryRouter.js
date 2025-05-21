const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyUser, verifyAdmin } = require('../middlewares/authMiddleware');

// Get all categories (public access)
router.get('/', categoryController.getAllCategories);

// Admin only routes
// Create new category
router.post('/', verifyUser, verifyAdmin, categoryController.createCategory);

// Update category
router.put('/:id', verifyUser, verifyAdmin, categoryController.updateCategory);

// Delete category
router.delete('/:id', verifyUser, verifyAdmin, categoryController.deleteCategory);

module.exports = router; 