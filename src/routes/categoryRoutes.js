const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const categoriesController = require('../controllers/categoriesController');

// show all categories
router.get('/', 
    wrapAsync(categoriesController.showCategories));


// Open category
router.get('/:id',  
    wrapAsync(categoriesController.openCategoryPage));


// Insert Thread
router.post('/:id',  
    wrapAsync(categoriesController.insertThread));


// ------------------- THREAD ROUTES (Nested) -------------------


//Open Thread
router.get('/:id/threads/:thread_id',  
    wrapAsync(categoriesController.openThread)); 


// Delete Thread
router.delete('/:id/threads/:thread_id',  
    wrapAsync(categoriesController.deleteThread)); 
    


// ------------------- COMMENT ROUTES (Nested under thread) -------------------

// Post a comment
router.post('/:id/threads/:thread_id/comments',  
    wrapAsync(categoriesController.insertComment)); 


// Delete a comment
router.delete('/:id/threads/:thread_id/comments/:comment_id',  
    wrapAsync(categoriesController.deleteComment));

module.exports = router;