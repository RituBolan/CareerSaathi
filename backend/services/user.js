const User = require("../models/user");
const { createTokenForUser, hashPassword, comparePassword } = require("./auth");

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    bio: user.bio || "",
    location: user.location || "",
    targetRole: user.targetRole || "",
    skills: user.skills || [],
  };
}

async function createUser(data) {
  const { name, email, phone, password, gender } = data;

  if (!name || !email || !phone || !password) {
    throw new Error("Name, email, phone, and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    phone,
    gender,
    password: hashedPassword,
  });

  return sanitizeUser(user);
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) return { success: false, message: "Invalid credentials" };

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return { success: false, message: "Invalid credentials" };

  return {
    success: true,
    token: createTokenForUser(user),
    user: sanitizeUser(user),
  };
}

module.exports = {
  createUser,
  loginUser,
  sanitizeUser,
};
