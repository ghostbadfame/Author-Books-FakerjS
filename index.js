const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Add this line
const { faker } = require('@faker-js/faker');
const { authenticateUser } = require('./middleware/authentication');
const Author = require('./models/Author');
const Book = require('./models/Book');
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect(process.env.URI, {});
const db = mongoose.connection;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser()); // Add this line

// Generate JWT token
const generateToken = (authorId) => {
  // Replace 'your_secret_key' with a secure key for JWT token generation
  return jwt.sign({ authorId }, 'defaultSecretKey', { expiresIn: '1h' });
};


// Create mock data for users and books on server start
const createMockData = async () => {
  try {
    await Author.deleteMany();
    await Book.deleteMany();

    const authors = Array.from({ length: 5 }, () => ({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      phone_no: faker.phone.number(),
      password: faker.internet.password(),
    }));

    const createdAuthors = await Author.insertMany(authors);

    for (const author of createdAuthors) {
      const books = Array.from({ length: 1 }, () => ({
        title: faker.word.words(1),
        likes: faker.number.int(50), // Random likes for each book
        author: author._id,
      }));

      await Book.insertMany(books);
    }

    console.log('Mock data generated.');
  } catch (error) {
    console.error('Error generating mock data:', error);
  }
};

createMockData();

// Authentication route
app.post('/auth/login', async (req, res) => {
  try {
    // console.log("Hello");
    const { email, password } = req.body;

    const author = await Author.findOne({ email });

    if (!author || author.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(author._id);
    res.cookie('jwt', token, { httpOnly: true }); // Set the JWT token in a cookie
    res.cookie('authorId', author._id.toString(), { httpOnly: true });
    console.log(req.cookies)
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Routes
app.use('/authors', authenticateUser, authorRoutes);
app.use('/books', authenticateUser, bookRoutes); // Apply authentication middleware to book routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
