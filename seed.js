const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const { act } = require("react");
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

const ProductSchema = new mongoose.Schema({
  code: String,
  name: String,
  price: Number,
  discount: Number,
  image: String,
  active: Boolean,
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function seedAdminUser() {
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

async function seedProducts() {
  const PRODUCTS = [
    { code: "001", name: "Coffee", price: 6, discount: 0.1, active: true, image: "/categories/coffee.png" },
    { code: "002", name: "Pizza", price: 12, discount: 0.25, active: true, image: "/categories/pizza.png" },
    { code: "003", name: "Sandwich", price: 16, discount: 0.3, active: true, image: "/categories/sandwich.png" }
  ];
  for (const p of PRODUCTS) {
    const exists = await Product.findOne({
      name: new RegExp(`^${p.name}$`, "i"),
    });

    if (!exists) {
      await Product.create(p);
      console.log("Inserted:", p.name);
    } else {
      console.log("Skipped:", p.name);
    }
  }
}

seedAdminUser();
seedProducts();