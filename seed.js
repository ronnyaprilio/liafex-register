const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env.local"),
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not defined in .env.local");
}

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");

    const existing = await User.findOne({ username: process.env.INIT_ADMIN_USERNAME });

    if (existing) {
      console.log("User already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.INIT_ADMIN_PASSWORD, 10);

    await User.create({
      username: process.env.USERNAME,
      password: hashedPassword,
    });

    console.log("Admin user created successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();