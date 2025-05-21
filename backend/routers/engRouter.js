const express = require('express');
const englishDictionaryController = require('../controllers/englishDictionaryController');
const courseController = require('../controllers/courseController');
const categoryController = require('../controllers/categoryController');
const lessonsController = require('../controllers/lessonsController');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const { identifier } = require('../middlewares/identification');
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
router.get('/course/:id', courseController.getCourseById);
router.post('/enroll-course', identifier, courseController.enrollInCourse);

//category controller
router.get('/all-categories',  categoryController.getAllCategories);
router.post('/create-category', categoryController.createCategory);

//lessons controller
router.get('/all-lessons', lessonsController.getAllLessons);
router.get('/lesson/:id', lessonsController.getLessonById);
router.post('/create-lesson', upload.single('audio'), lessonsController.createLesson);

module.exports = router;