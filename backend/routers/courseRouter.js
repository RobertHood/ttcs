const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyUser, verifyAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/courses'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Get all courses (public access)
router.get('/', courseController.getAllCourses);

// Admin only routes
// Create new course with image upload
router.post('/', verifyUser, verifyAdmin, upload.single('headerImage'), courseController.createCourse);

// Update course
router.put('/:id', verifyUser, verifyAdmin, upload.single('headerImage'), courseController.updateCourse);

// Delete course
router.delete('/:id', verifyUser, verifyAdmin, courseController.deleteCourse);

module.exports = router; 