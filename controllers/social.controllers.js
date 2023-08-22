const User = require("../models/users.model")
const Book = require("../models/books.model")

const getFollowedUsers = async (req, res) => {
  const userId = req.user._id; // Current user's ID
  try {
    const currentUser = await User.findById(userId).populate('follows.following_id');
    if (!currentUser) {
      return res.status(404).send({ message: "User not found." });
    }

    const followedUsers = currentUser.follows.map(follow => follow.following_id);

    if (followedUsers.length === 0) {
      res.status(200).send({ message: "You are not following any users." });
    } else {
      res.status(200).send(followedUsers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching followed users.");
  }
};

const getNotFollowedUsers = async (req, res) => {
  const userId = req.user._id; // Current user's ID
  try {
    const currentUser = await User.findById(userId).populate('follows.following_id');
    if (!currentUser) {
      return res.status(404).send({ message: "User not found." });
    }

    const followedUserIds = currentUser.follows.map(follow => follow.following_id._id);
    const notFollowedUsers = await User.find(
      { _id: { $nin: [userId, ...followedUserIds] } },
      // Select the desired fields
      'books first_name last_name profile_picture username _id'
    );

    res.status(200).send(notFollowedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching users.");
  }
};  


const followUser = async (req, res) => {
  const followerId = req.user._id; // Current user's ID
  const followingId = req.params.id; // User ID to follow
  console.log(followingId)

  try {
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);
    console.log(following)

    if (!follower || !following) {
      return res.status(404).send({ message: "User not found." });
    }

    follower.follows.push({ follower_id: followerId, following_id: followingId });
    following.follows.push({ follower_id: followerId, following_id: followingId });

    await follower.save();
    await following.save();

    res.status(200).send({ message: "User followed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while following the user.");
  }
};

const unfollowUser = async (req, res) => {
  const followerId = req.user._id; // Current user's ID
  const followingId = req.params.id; // User ID to unfollow

  try {
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      return res.status(404).send({ message: "User not found." });
    }

    follower.follows = follower.follows.filter(follow => follow.following_id.toString() !== followingId);
    following.follows = following.follows.filter(follow => follow.follower_id.toString() !== followerId);

    await follower.save();
    await following.save();

    res.status(200).send({ message: "User unfollowed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while unfollowing the user.");
  }
};

const booksFeed = async (req, res) => {
  const userId = req.user._id; // Current user's ID
  try {
    const user = await User.findById(userId).populate('follows.following_id');
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const followedUserIds = user.follows.map(follow => follow.following_id._id);
    
    const suggestions = await Book.find({ user_id: { $in: followedUserIds } })
      .populate('user_id', 'username'); // Populate the user_id field with username

    if (suggestions.length === 0) {
      res.status(200).send({ message: "Start following users to see their books." });
    } else {
      res.status(200).send(suggestions);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching book suggestions.");
  }
};


module.exports =
  {booksFeed,
  getFollowedUsers,
  getNotFollowedUsers,
  followUser,
  unfollowUser
  }