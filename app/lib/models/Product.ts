import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    code: { 
      type: String, 
      unique: true, 
      required: true,
      trim: true,
      minlength: 3
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    price: { 
      type: Number, 
      required: true,
      min: 0,
    },
    discount: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 1
    },
    image: { 
      type: String, 
      default: "/categories/default.png" 
    },
    active: { 
      type: Boolean, 
      default: true 
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);