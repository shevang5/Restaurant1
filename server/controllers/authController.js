import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const normalizePhone = (value = "") => value.replace(/[^\d+]/g, "").trim();
const normalizeEmail = (value = "") => value.trim().toLowerCase();

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedEmail) return res.status(400).json({ message: "Email is required" });
    if (!normalizedPhone) return res.status(400).json({ message: "Phone number is required" });

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) return res.status(400).json({ message: "Email already registered" });
    const phoneExists = await User.findOne({ phone: normalizedPhone });
    if (phoneExists) return res.status(400).json({ message: "Phone number already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, phone: normalizedPhone, password: hashed });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, phone, loginId, password } = req.body;
    const credential = (loginId || email || phone || "").trim();
    if (!credential) return res.status(400).json({ message: "Email or phone is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    const loginQuery = credential.includes("@")
      ? { email: normalizeEmail(credential) }
      : { phone: normalizePhone(credential) };
    const user = await User.findOne(loginQuery);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Support legacy plain-text passwords and migrate them to bcrypt on successful login.
    const isBcryptHash = typeof user.password === "string" && user.password.startsWith("$2");
    let isMatch = false;
    if (isBcryptHash) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
      if (isMatch) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import crypto from "crypto";
import nodemailer from "nodemailer";

// POST /auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No user found with that email" });

  // Generate secure token
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min expiry
  await user.save();

  // Send email (configure transport in production)
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use your SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`
  });

  res.json({ message: "Password reset link sent to your email." });
};

// POST /auth/reset-password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password has been reset. You can now log in." });
};

