const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createComment, getCommentsByBurger, deleteComment } = require('../controllers/commentController');
const router = express.Router();

router.post('/', authenticate, createComment);

router.get('/burger/:id', getCommentsByBurger);

router.delete('/:id', authenticate, deleteComment);

module.exports = router;
