const User = require("../models/users.model")
const Book = require("../models/books.model")
const Genre = require("../models/genres.model")


const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching books.");
  }
};

const createBook = async (req, res) => {
  const { title, author, picture_url, review, genres} = req.body;
  const user_id = req.user._id;

  try {
    const user = await User.findById(user_id); // Retrieve the user using their ID
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const bookGenres = [];
    for (const genreName of genres) {
      const existingGenre = await Genre.findOne({ genre_name: genreName });
      if (existingGenre) {
        bookGenres.push(existingGenre);
      } else {
        const newGenre = new Genre({ genre_name: genreName });
        await newGenre.save();
        bookGenres.push(newGenre);
      }
    }

    const newBook = new Book({
      title,
      author,
      picture_url,
      review,
      user_id,
      genres: bookGenres
    });

    user.books.push(newBook);

    await user.save();

    await newBook.save();

    res.status(201).send(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the book.");
  }
};

const updateBook = async (req, res) => {
  const bookId = req.params.id; // Assuming the book ID is provided in the URL parameter
  const { title, author, picture_url, review, genres } = req.body;
  const userId = req.user._id; // Assuming the user ID is available from authentication

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: "Book not found." });
    }

    // Check if the user is the creator of the book
    if (book.user_id.toString() !== userId) {
      return res.status(403).send({ message: "You are not authorized to modify this book." });
    }

    // Update book fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (picture_url) book.picture_url = picture_url;
    if (review) book.review = review;

    // Update genres
    const bookGenres = [];
    for (const genreName of genres) {
      const existingGenre = await Genre.findOne({ genre_name: genreName });
      if (existingGenre) {
        bookGenres.push(existingGenre);
      } else {
        const newGenre = new Genre({ genre_name: genreName });
        await newGenre.save();
        bookGenres.push(newGenre);
      }
    }
    book.genres = bookGenres;

    await book.save();

    res.status(200).send(book);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while modifying the book.");
  }
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id; // Assuming the book ID is provided in the URL parameter
  const userId = req.user._id; // Assuming the user ID is available from authentication

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: "Book not found." });
    }

    // Check if the user is the creator of the book
    if (book.user_id.toString() !== userId) {
      return res.status(403).send({ message: "You are not authorized to delete this book." });
    }

    // Remove the book reference from the user's books array
    const user = await User.findById(userId);
    user.books.pull(bookId);
    await user.save();

    // Delete the book
    await Book.findByIdAndRemove(bookId);

    res.status(200).send({ message: "Book deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the book.");
  }
};

const likeBook = async (req, res) => {
  const bookId = req.params.id; // Assuming the book ID is provided in the URL parameter
  const userId = req.user._id; // Assuming the user ID is available from authentication

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: "Book not found." });
    }

    const user = await User.findById(userId);

    // Check if the user has already liked the book
    if (user.liked_books.includes(bookId)) {
      return res.status(400).send({ message: "You have already liked this book." });
    }

    // Add the book to the user's liked_books array
    user.liked_books.push(bookId);
    await user.save();

    res.status(200).send({ message: "Book liked successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while liking the book.");
  }
};

const unlikeBook = async (req, res) => {
  const bookId = req.params.id; // Assuming the book ID is provided in the URL parameter
  const userId = req.user._id; // Assuming the user ID is available from authentication

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: "Book not found." });
    }

    const user = await User.findById(userId);

    // Check if the user has liked the book
    if (!user.liked_books.includes(bookId)) {
      return res.status(400).send({ message: "You have not liked this book." });
    }

    // Remove the book from the user's liked_books array
    user.liked_books.pull(bookId);
    await user.save();

    res.status(200).send({ message: "Book unliked successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while unliking the book.");
  }
};

const getBooksByTitle = async (req, res) => {
  const title = req.params.title; // Assuming the title is provided in the URL parameter

  try {
    const books = await Book.find({ title: { $regex: title, $options: "i" } });
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching books by title.");
  }
};

const getBooksByGenre = async (req, res) => {
  const genre = req.params.genre; // Assuming the genre is provided in the URL parameter

  try {
    const books = await Book.find({ "genres.genre_name": { $regex: genre, $options: "i" } });
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching books by genre.");
  }
};

const getBooksByAuthor = async (req, res) => {
  const author = req.params.author; // Assuming the author is provided in the URL parameter

  try {
    const books = await Book.find({ author: { $regex: author, $options: "i" } });
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching books by author.");
  }
};

module.exports =
  {getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  likeBook,
  unlikeBook,
  getBooksByAuthor,
  getBooksByGenre,
  getBooksByTitle
  }