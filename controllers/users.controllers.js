const User = require("../models/users.model")

const getAllUsers = async (req, res)=>{
    const users = await User.find();
    res.send(users)
}

const getProfile = async (req, res)=>{
    console.log(req.user)
    const user = await User.findById(req.user._id)
    res.send(user)
}

const Test = async (req, res)=>{
  console.log('akal')
  res.send('akal')
}

module.exports = {getAllUsers, getProfile, Test}