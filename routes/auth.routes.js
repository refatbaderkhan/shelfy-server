const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
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

router.post("/login", authController.login)
router.post("/register", upload.single("profile_picture"), authController.register);

module.exports = router;