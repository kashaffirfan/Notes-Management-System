const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ✅ Register Controller
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<h3>Click to verify:</h3><a href="${verificationUrl}">Verify Email</a>`,
    });

    res.status(201).json({ msg: "Registration successful. Check your email to verify." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (!user.isVerified) {
  return res.status(401).json({ msg: "Please verify your email first." });
}


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ Generate JWT with user id (IMPORTANT)
    const token = jwt.sign(
      { id: user._id }, // must be 'id' so authMiddleware works correctly
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "✅ Logged in successfully!",
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "❌ Server error" });
  }
};

