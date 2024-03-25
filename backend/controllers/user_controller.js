const User = require("../modals/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const SECERT = process.env.JWT_KEY_SECERT;

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

    const token = jwt.sign({ user: user._id }, SECERT, { expiresIn: "1hr" });

    res.cookie(String(user._id), token, {
      path: "/",
      expires: new Date(Date.now() + 2000 * 30),
      httpOnly: true,
      sameSite: "lax",
    });

    return res
      .status(200)
      .json({ msg: "Successfully Logged In !!", user, token });
  } catch (e) {
    return res.status(500).json({ msg: "Unexpected error occured", e });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    //if you are storing token in the frontend
    // const headers = req.headers[`authorization`];
    // const token = headers.split(" ")[1];

    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];

    const SECERT = process.env.JWT_KEY_SECERT;
    if (!token) {
      return res.status(404).json({ msg: "No token found" });
    }

    jwt.verify(String(token), SECERT, (err, data) => {
      if (err) {
        return res.status(400).json({ msg: "Invalid Token" });
      }
      req.id = data.user;
      next();
    });
  } catch (e) {
    return res.status(500).json({ msg: "Unexpected error occured", e });
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId, "-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json(user);
  } catch (e) {
    return res.status(200).json(e);
  }
};

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
