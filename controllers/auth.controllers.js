const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/users.model")

const login = async (req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user) return res.status(404).send({message: "email/password incorrect"});
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return res.status(404).send({message: "email/password incorrect"});

    const {password: hashedPassword, username, _id, ...userInfo} = user.toJSON();
    const token = jwt.sign({username, email, _id}, process.env.JWT_SECRET)

    res.send({
        token,
        user: userInfo
    })

}

const register = async (req, res) => {
  const { password, username, first_name, last_name, email, profile_picture } = req.body;
  try {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });

      if (existingUser) {
          return res.status(400).send("Username or email already exists.");
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
          username,
          first_name,
          last_name,
          email,
          profile_picture,
          password: hashedPassword
      });

      await user.save();
      res.status(201).send({user, message:"Account created successfully."});
  } catch (error) {
      res.status(500).send("An error occurred while registering the user.");
  }
};

const Test1 = async (req, res)=>{
  console.log('akal')
  res.send('akal')
}

const verify = (_, res)=>{
  console.log('lesh')
    res.send("Verfied")
}

module.exports = {login, register, verify, Test1}