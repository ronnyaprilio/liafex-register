import Product from "@/app/lib/models/Product";
import { connectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  try {
    const { code } = await Promise.resolve(params);

    await connectDB();

    const product = await Product.findOne({ code, active: true }).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { code: string } }) {
  try {
    const { code } = await Promise.resolve(params);
    const body = await req.json();

    if (!body.name || typeof body.price !== "number" || typeof body.discount !== "number") {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    await connectDB();

    const updated = await Product.findOneAndUpdate(
      { code },
      {
        $set: {
          name: body.name.trim(),
          price: body.price,
          discount: body.discount,
          image: body.image || "/categories/default.png",
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { code: string } }) {
  try {
    const { code } = await Promise.resolve(params);
    await connectDB();

    const deleted = await Product.findOneAndUpdate(
      { code },
      { $set: { active: false } },
      { new: true }
    );

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}