const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controllers");
const socialController = require("../controllers/social.controllers");


router.get("/", usersController.getAllUsers)
router.get("/profile", usersController.getProfile)
router.get("/test", usersController.Test)

router.post("/:id", socialController.followUser)
router.delete("/:id", socialController.unfollowUser)
router.get("/feed", socialController.booksFeed)


module.exports = router;