const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const Author = require('../models/Author');
const Book = require('../models/Book');
const mongoose = require('mongoose');
// const { authorize } = require('../middleware/authorize');

// Get all authors with the number of books published
router.get('/', authenticateUser, async (req, res) => {
  try {
    const authors = await Author.find();
    const authorsWithBooksCount = await Promise.all(authors.map(async (author) => {
      const bookCount = await Book.countDocuments({ author: author._id });
      return {
        ...author.toObject(),
        booksCount: bookCount,
      };
    }));
    res.status(200).json(authorsWithBooksCount);
  } catch (error) {
    handleRouteError(error, res);
  }
});

// Get details of the logged-in author
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const adminId = String(req.cookies.authorId);
    console.log(adminId)
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: 'Invalid author ID format' });
    }

    const loggedAuthor = await Author.findById(adminId);
    console.log(loggedAuthor)
    if (!loggedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const books = await Book.find({ author: loggedAuthor._id });
    res.status(200).json({ ...loggedAuthor.toObject(), books });
  } catch (error) {
    handleRouteError(error, res);
  }
});

// Get author details by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const books = await Book.find({ author: author._id });
    res.status(200).json({ ...author.toObject(), books });
  } catch (error) {
    handleRouteError(error, res);
  }
});




// Helper function to handle errors in routes
function handleRouteError(error, res) {
  console.error('Error in route:', error);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).json({ message: 'Invalid author ID format' });
  }

  res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = router;
