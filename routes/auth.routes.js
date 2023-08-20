const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/login", authController.login)
router.post("/register", authController.register)
router.get("/test1", authController.Test1)
router.get("/verify", authMiddleware, authController.verify)

module.exports = router;