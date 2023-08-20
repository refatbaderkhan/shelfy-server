const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controllers");

router.get("/", usersController.getAllUsers)
router.get("/profile", usersController.getProfile)
router.get("/test", usersController.Test)

module.exports = router;