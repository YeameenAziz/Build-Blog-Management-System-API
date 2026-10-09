const User = require("../models/user.model");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
};

module.exports = { getProfile, updateProfile };