const express = require('express');
const englishDictionaryController = require('../controllers/englishDictionaryController');
const courseController = require('../controllers/courseController');
const categoryController = require('../controllers/categoryController');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

//Search for a word in the dictionary
router.get('/search', englishDictionaryController.wordSearch);

//course controller
router.get('/all-courses', courseController.getAllCourses);
router.post('/create-course',upload.single('headerImage'), courseController.createCourse);

//category controller
router.get('/all-categories',  categoryController.getAllCategories);
router.post('/create-category', categoryController.createCategory);
module.exports = router;