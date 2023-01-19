const express = require("express");
const router = express.Router();
const TokensController = require("../controllers/tokens");

const { loginUser, signupUser, findUser, friendRequest, editProfile } = require('../controllers/users')

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/:id", findUser)
router.patch("/:id", friendRequest)
router.patch("/profile/:id", editProfile)


module.exports = router;
