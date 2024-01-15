const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const Book = require('../models/Book');
const mongoose = require('mongoose');
// const { authorize } = require('../middleware/authorize');

// Get all books (paginated and sorted by likes)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort === 'most_likes' ? { likes: -1 } : { likes: 1 };

    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);

    res.status(200).json(books);
  } catch (error) {
    handleRouteError(error, res);
  }
});

router.put('/like/:id', authenticateUser, async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { likes: 1 } }, // Increment the likes by 1
      { new: true } // Return the updated document
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book liked successfully', likes: book.likes });
  } catch (error) {
    console.error('Error liking the book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Unlike a book
router.put('/unlike/:id', authenticateUser, async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { likes: -1 } }, // Decrement the likes by 1
      { new: true } // Return the updated document
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book unliked successfully', likes: book.likes });
  } catch (error) {
    console.error('Error unliking the book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Helper function to handle errors in routes
function handleRouteError(error, res) {
  console.error('Error in route:', error);
  res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = router;
