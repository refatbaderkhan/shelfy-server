const express = require("express");
const router = express.Router();
const booksController = require("../controllers/books.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", booksController.allBooks)
router.post("/create", booksController.createBook)
router.post("/update/:id", booksController.updateBook)
router.delete("/:id", booksController.deleteBook)
router.post("/like/:id", booksController.likeBook)
router.post("/unlike/:id", booksController.unlikeBook)
router.get("/author/:author", booksController.getBooksByAuthor)
router.get("/genre/:genre", booksController.getBooksByGenre)
router.get("/title/:title", booksController.getBooksByTitle)


module.exports = router;