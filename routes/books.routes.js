const express = require("express");
const router = express.Router();
const booksController = require("../controllers/books.controllers");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    const originalFilename = file.originalname;
    cb(null, originalFilename);
  },
});

const upload = multer({ storage: storage });

router.get("/", booksController.allBooks)
router.get("/my", booksController.getUserBooks)
router.get("/:id", booksController.getBookById)
router.post("/create", upload.single("picture_url"), booksController.createBook)
router.post("/update/:id", booksController.updateBook)
router.delete("/:id", booksController.deleteBook)
router.post("/like/:id", booksController.likeBook)
router.post("/unlike/:id", booksController.unlikeBook)
router.get("/author/:author", booksController.getBooksByAuthor)
router.get("/genre/:genre", booksController.getBooksByGenre)
router.get("/title/:title", booksController.getBooksByTitle)


module.exports = router;