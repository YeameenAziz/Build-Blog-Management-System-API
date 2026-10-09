const express = require("express");
const {
  getProfile,
  updateProfile
} = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

module.exports = router;