const express = require('express');
const ieltsSpeakingController = require('../controllers/ieltsSpeakingController');
const ieltsListeningController = require('../controllers/ieltsListeningController');
const ieltsWritingController = require('../controllers/ieltsWritingController');
const ieltsReadingController = require('../controllers/ieltsReadingController');
const router = express.Router();

//Listening
router.post('/create-listening', ieltsListeningController.createListening);
router.get('/get-listening-by-title', ieltsListeningController.getListeningbyTitle);
router.get('/get-listening-by-category', ieltsListeningController.getListeningbyCategory);
router.get('/get-all-listening', ieltsListeningController.getAllListening);

//Reading
router.post('/create-reading', ieltsReadingController.createReading);
router.get('/get-reading-by-title', ieltsReadingController.getReadingbyTitle);
router.get('/get-reading-by-category', ieltsReadingController.getReadingbyCategory);
router.get('/get-all-reading', ieltsReadingController.getAllReading);

//Speaking
router.post('/create-speaking', ieltsSpeakingController.createSpeaking);
router.get('/get-speaking-by-part', ieltsSpeakingController.getSpeakingbyPart);
router.get('/get-speaking-by-topic', ieltsSpeakingController.getSpeakingbyTopic);
router.get('/get-all-speaking', ieltsSpeakingController.getAllSpeaking);

module.exports = router;