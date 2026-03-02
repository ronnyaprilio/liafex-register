import Product from "@/app/lib/models/Product";
import { connectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ active: true })
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("CREATE PRODUCT BODY:", body);

    if (
      !body.name ||
      typeof body.price !== "number" ||
      typeof body.discount !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    const exists = await Product.findOne({
      name: new RegExp(`^${body.name}$`, "i"),
    });

    if (exists) {
      return NextResponse.json(
        { error: "Product already exists" },
        { status: 409 }
      );
    }

    const product = await Product.create({
      code: body.code.trim(),
      name: body.name.trim(),
      price: body.price,
      discount: body.discount,
      image: body.image || "/categories/default.png",
      active: true,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}