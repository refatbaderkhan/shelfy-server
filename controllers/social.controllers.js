const User = require("../models/users.model")
const Book = require("../models/books.model")



const getFollowedUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const currentUser = await User.findById(userId).populate('follows.following_id');

    const followedUsers = currentUser.follows.map(follow => follow.following_id);

    res.status(200).send(followedUsers);
    
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const getNotFollowedUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const currentUser = await User.findById(userId).populate('follows.following_id');

    const followedUserIds = currentUser.follows.map(follow => follow.following_id._id);
    const notFollowedUsers = await User.find(
      { _id: { $nin: [userId, ...followedUserIds] } },
      'books first_name last_name profile_picture username _id'
    );

    res.status(200).send(notFollowedUsers);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const followUser = async (req, res) => {
  const followerId = req.user._id;
  const followingId = req.params.id;

  try {
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    follower.follows.push({ follower_id: followerId, following_id: followingId });
    following.follows.push({ follower_id: followerId, following_id: followingId });

    await follower.save();
    await following.save();

    res.status(200).send({ message: "User followed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

const unfollowUser = async (req, res) => {
  const followerId = req.user._id;
  const followingId = req.params.id;

  try {
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    follower.follows = follower.follows.filter(follow => follow.following_id.toString() !== followingId);
    following.follows = following.follows.filter(follow => follow.follower_id.toString() !== followerId);

    await follower.save();
    await following.save();

    res.status(200).send({ message: "User unfollowed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};



const booksFeed = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate('follows.following_id');

    const followedUserIds = user.follows.map(follow => follow.following_id._id);
    
    const suggestions = await Book.find({ user_id: { $in: followedUserIds } })
    .populate('user_id', 'username profile_picture');

    if (suggestions.length === 0) {
      res.status(200).send({ message: "Start following users to see their books." });
    } else {
      res.status(200).send(suggestions);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};


module.exports =
  {booksFeed,
  getFollowedUsers,
  getNotFollowedUsers,
  followUser,
  unfollowUser
  }