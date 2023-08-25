const User = require("../models/users.model")
const Book = require("../models/books.model")



const allBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching books.");
  }
};



const getUserBooks = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate('books');

    const userBooks = user.books;

    if (userBooks.length === 0) {
      res.status(200).send({ message: "You don't have any books yet." });
    } else {
      res.status(200).send(userBooks);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const getBookById = async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user._id;

  try {
    const book = await Book.findById(bookId).populate('genres');

    const user = await User.findById(userId);

    const isLikedByUser = user.liked_books.includes(bookId);

    const bookWithLikeInfo = {
      _id: book._id,
      title: book.title,
      author: book.author,
      picture_url: book.picture_url,
      review: book.review,
      user_id: book.user_id,
      genres: book.genres,
      isLikedByUser: isLikedByUser
    };

    res.status(200).send(bookWithLikeInfo);

  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const createBook = async (req, res) => {
  const { title, author , review} = req.body;
  const picture_url = req.file ? req.file.filename : "";

  const user_id = req.user._id;

  try {
    const user = await User.findById(user_id);


    const newBook = new Book({
      title,
      author,
      picture_url,
      review,
      user_id,
    });

    user.books.push(newBook);

    await user.save();

    await newBook.save();

    res.status(201).send(newBook);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const { title, author, picture_url, review, genres } = req.body;
  const userId = req.user._id;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: "Book not found." });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (picture_url) book.picture_url = picture_url;
    if (review) book.review = review;

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
  const bookId = req.params.id;
  const userId = req.user._id;

  try {
    const book = await Book.findById(bookId);

    if (book.user_id.toString() !== userId) {
      return res.status(403).send({ message: "You are not authorized to delete this book." });
    }

    const user = await User.findById(userId);
    user.books.pull(bookId);
    await user.save();

    await Book.findByIdAndRemove(bookId);

    res.status(200).send({ message: "Book deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const likeBook = async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user._id;

  try {
    const book = await Book.findById(bookId);

    const user = await User.findById(userId);

    if (user.liked_books.includes(bookId)) {
      return res.status(400).send({ message: "You have already liked this book." });
    }

    user.liked_books.push(bookId);
    await user.save();

    res.status(200).send({ message: "Book liked successfully." });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const unlikeBook = async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user._id;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ message: "Book not found." });
    }

    const user = await User.findById(userId);

    if (!user.liked_books.includes(bookId)) {
      return res.status(400).send({ message: "You have not liked this book." });
    }

    user.liked_books.pull(bookId);
    await user.save();

    res.status(200).send({ message: "Book unliked successfully." });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const getBooksByTitle = async (req, res) => {
  const title = req.params.title;

  try {
    const books = await Book.find({ title: { $regex: title, $options: "i" } });
    if (books.length === 0) {
      return res.status(200).send({ message: "No matches." });
    }
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const getBooksByGenre = async (req, res) => {
  const genre = req.params.genre;

  try {
    const books = await Book.find({ "genres.genre_name": { $regex: genre, $options: "i" } })

    if (books.length === 0) {
      return res.status(200).send({ message: "No matches." });
    }
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const getBooksByAuthor = async (req, res) => {
  const author = req.params.author;

  try {
    const books = await Book.find({ author: { $regex: author, $options: "i" } });
    if (books.length === 0) {
      return res.status(200).send({ message: "No matches." });
    }
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



module.exports =
  {allBooks,
  getUserBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  likeBook,
  unlikeBook,
  getBooksByAuthor,
  getBooksByGenre,
  getBooksByTitle
  }