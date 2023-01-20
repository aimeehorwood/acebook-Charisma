const TokenGenerator = require("../models/token_generator");
const User = require("../models/user");

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}
const signupUser = async (req, res) => {
  const {name, email, password, aboutMe, image} = req.body
  try {
    const user = await User.signup(name, email, password, aboutMe, image)
    res.status(201).json({email})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const loginUser = async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await User.login(email, password)
    const token = await TokenGenerator.jsonwebtoken(user.id)
    res.status(200).json({ token: token, user: user, message: "OK" })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const findUser = async (req, res) => {
  try {
    user_id = req.params.id
    const user = await User.findById(user_id)
    res.status(200).json({user: user})
  } catch (error) {
    res.status(404).json({error: 'This user no longer exists'})
  }
}

const friendRequest = async (req,res) => {
    profile_id = req.params.id
    requester_id = req.body.requester
    field = req.body.field
    if (field === 'request') {
      const user = await User.findOne({_id: profile_id})
      const friendRequests = user.friendRequests.toObject()
      if (!friendRequests.includes(requester_id)) {
        update = await User.findOneAndUpdate({_id: profile_id}, {$push: {friendRequests: requester_id}})
      }
    } else if (field === 'accept') {
      update = await User.findOneAndUpdate({_id: requester_id}, {$pull: {friendRequests: profile_id}})
      update = await User.findOneAndUpdate({_id: profile_id}, {$pull: {friendRequests: requester_id}})
      update1 = await User.findOneAndUpdate({_id: profile_id}, {$push: {friends: requester_id}})
      update2 = await User.findOneAndUpdate({_id: requester_id}, {$push: {friends: profile_id}})
    } else if (field === 'reject') {
      update = await User.findOneAndUpdate({_id: profile_id}, {$pull: {friendRequests: requester_id}})
    } else if (field === 'delete') {
      update = await User.findOneAndUpdate({_id: profile_id}, {$pull: {friends: requester_id}})
      update = await User.findOneAndUpdate({_id: requester_id}, {$pull: {friends: profile_id}})
    } else {
      res.status(400).json({ message: error.message})
    }
    const token = await TokenGenerator.jsonwebtoken(req.user_id)
    res.status(200).json({ message: 'OK', token: token });
  }
  const editProfile = async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, aboutMe, image } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { _id: id }, 
        { $set: { name, email, aboutMe, image } },
        { new: true }
      );
      const token = await TokenGenerator.jsonwebtoken(id)
      res.status(200).send({ message: "User updated successfully", updatedUser, token: token });
    } catch (error) {
      res.status(500).send({ message: "Error updating user", error });
    }
  };
    
module.exports = { signupUser, loginUser, findUser, friendRequest, editProfile }

