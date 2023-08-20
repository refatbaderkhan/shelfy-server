const mongoose = require("mongoose");
const User = require("./users.model");
const Genre = require("./genres.model");


const booksSchema = new mongoose.Schema({
  title: String,
  author: String,
  picture_url: String,
  review: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  genres: [Genre.schema],
}, {
  timestamps: true,
});

const Book = mongoose.model('Book', booksSchema);
module.exports = Book;
