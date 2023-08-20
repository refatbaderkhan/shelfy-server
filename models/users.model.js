const mongoose = require("mongoose");
const Book = require("./books.model");


const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  first_name: String,
  last_name: String,
  email: {
      type: String,
      unique: true,
  },
  profile_picture: String,
  password: String,
  books: [Book.schema],
  liked_books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  follows: [{
    follower_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    following_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
}, {
  timestamps: true
})

const User = mongoose.model('User', usersSchema);
module.exports = User