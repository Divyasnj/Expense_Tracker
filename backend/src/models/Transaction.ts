// backend/src/models/Transaction.ts
import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    date: { type: Date, required: true },
    notes: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

export default mongoose.model('Transaction', transactionSchema)
