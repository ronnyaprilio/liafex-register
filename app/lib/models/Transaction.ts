import mongoose, { HydratedDocument } from "mongoose";

const TransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  items: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  transaction_ref: {
    type: String,
    unique: true,
    index: true,
    immutable: true,
  },
}, { timestamps: true });

TransactionSchema.pre("save", async function (this: HydratedDocument<any>) {
  console.log("Generating transaction reference for new transaction...");
  if (!this.transaction_ref) {
    const now = new Date();

    const date =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");

    const time =
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const random = Math.floor(1000 + Math.random() * 9000);

    this.transaction_ref = `POS-${date}-${time}-${random}`;
  }
  console.log("Transaction reference for new transaction: ", this.transaction_ref);
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);