const mongoose = require("mongoose");
const Book = require("./books.model");


const genresSchema = new mongoose.Schema({
  genre_name: String,
});

const Genre = mongoose.model('Genre', genresSchema);
module.exports = Genre;
