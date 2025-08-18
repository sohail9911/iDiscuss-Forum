const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');
const wrapAsync = require('../utils/wrapAsync');

// Show search Results
router.get('/', 
    wrapAsync(searchController.showSearchResults));
module.exports = router;