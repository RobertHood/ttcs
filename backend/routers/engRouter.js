const express = require('express');
const englishDictionaryController = require('../controllers/englishDictionaryController');
const router = express.Router();

//Search for a word in the dictionary
router.get('/search', englishDictionaryController.wordSearch);

module.exports = router;