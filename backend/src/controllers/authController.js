const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = generateToken(res, admin._id);

    res.status(200).json({
      _id: admin._id,
      username: admin.username,
      token
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      _id: admin._id,
      username: admin.username
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { loginAdmin, getMe };