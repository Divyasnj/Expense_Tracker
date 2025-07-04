// backend/src/models/categoryModel.ts
import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)
categorySchema.index({ name: 1, type: 1, userId: 1 }, { unique: true })
export default mongoose.model('Category', categorySchema)
