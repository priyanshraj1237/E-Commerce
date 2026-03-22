import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

const generateRefreshandAcessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
//cookies function....
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
const registeruser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (
      !userName ||
      !email ||
      !password ||
      !userName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const userExsist = await User.findOne({ email });
    if (userExsist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const user = await User.create({ userName, email, password });
    
    const { accessToken, refreshToken } = generateRefreshandAcessToken(user._id);
    setCookies(res, accessToken, refreshToken);
    
    res.status(201).json({
      _id: user._id,
      name: user.userName,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.log("Error in registration controller:", err.message);
    res.status(500).json({
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || !email.trim() || !password.trim()) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    
    const user = await User.findOne({ email }).maxTimeMS(5000);
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    
    const { accessToken, refreshToken } = generateRefreshandAcessToken(user._id);
    setCookies(res, accessToken, refreshToken);
    
    res.status(200).json({
      _id: user._id,
      name: user.userName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ 
      message: "Server error. Please try again later." 
    });
  }
};

const logout = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken && !refreshToken) {
      return res.status(200).json({
        message: "User already logged out",
      });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const testing_token = async (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user,
  });
};

const profile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.userName,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.log("Error in profile controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refresh token controller:", error.message);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export default {
  registeruser,
  testing_token,
  login,
  logout,
  profile,
  refreshToken,
};
