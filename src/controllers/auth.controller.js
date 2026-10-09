const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {


        const { name, email, password, phoneNumber } = req.body;

        const existingUser = await User.findOne({ email });


        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });


        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }

};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        const safeUser = await User.findById(user._id);
        res.status(200).json({
            message: "Login successful",
            user: safeUser
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

module.exports = { registerUser, loginUser };