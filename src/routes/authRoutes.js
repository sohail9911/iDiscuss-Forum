const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const upload = require('../utils/uploadProfile');
const authController = require('../controllers/authControllers');
const router = express.Router();

//Show Login Page
router.get('/login', 
    authController.showLoginPage);
    

//Handle Login
router.post('/login',
    wrapAsync(authController.handleLogin));


//Show Register Page
router.get('/register', 
    authController.showRegisterPage);


//Handle Registration
router.post('/register', 
    upload.single('profilePic'), 
    wrapAsync(authController.handleRegister));
    

// Logout
router.get('/logout',
    authController.logout);


// ----------------------------------- Password Forgotten -----------------------------------------

router.get('/forgot-password',
    authController.showForgotPassword);

module.exports = router;