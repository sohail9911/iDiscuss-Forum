const express = require('express');
const upload = require('../utils/uploadProfile');
const wrapAsync = require('../utils/wrapAsync');
const profileController = require('../controllers/profileController');
const router = express.Router();


router.get('/', 
    wrapAsync(profileController.showProfilePage));

router.post('/update', 
    upload.single('profilePic'),
    wrapAsync(profileController.updateProfile));

module.exports = router;