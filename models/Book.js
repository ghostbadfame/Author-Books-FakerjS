const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  likes: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
