import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    code: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    image: { type: String, default: "/categories/default.png" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);