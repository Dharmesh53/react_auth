const User = require("../modals/user");
const bcrypt = require("bcryptjs");

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPass = bcrypt.hashSync(password);
    const user = new User({
      name,
      email,
      password: hashedPass,
    });
    await user.save();
    return res.status(200).json({ msg: user });
  } catch (e) {
    console.log("Error", e);
    if (e.keyPattern.email == 1 && e.code == 11000) {
      return res
        .status(400)
        .json({ msg: "User already exists !! Please Login" });
    }
    return res.status(500).json({ msg: e });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User doesn't exist !! Please Signup" });
    }
    const isPassCorrect = bcrypt.compareSync(password, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }
    return res.status(200).json({ msg: "Successfully Logged In !!" });
  } catch (e) {
    return res.status(500).json({ msg: "Unexpected error occured" });
  }
};

exports.signup = signup;
exports.login = login;
