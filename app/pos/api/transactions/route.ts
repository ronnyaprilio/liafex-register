import Transaction from "@/app/lib/models/Transaction";
import { connectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";


export async function GET() {
  await connectDB();
  const transactions = await Transaction.find().sort({ createdAt: -1 });
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "Items cannot be empty" },
      { status: 400 }
    );
  }

  for (const item of body.items) {
    if (
      !item.id ||
      !item.name ||
      typeof item.price !== "number" ||
      item.price <= 0 ||
      typeof item.quantity !== "number" ||
      item.quantity <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid item structure" },
        { status: 400 }
      );
    }
  }

  if (typeof body.total !== "number" || body.total <= 0) {
    return NextResponse.json(
      { error: "Invalid total amount" },
      { status: 400 }
    );
  }

  const doc = new Transaction(body);
  const newTransaction = await doc.save();

  return NextResponse.json(newTransaction, { status: 201 });
}