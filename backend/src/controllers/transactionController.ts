// backend/src/controllers/transactionController.ts
import { Request, Response } from 'express'
import Transaction from '../models/Transaction'

interface AuthRequest extends Request {
  userId?: string
}

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Received data:', req.body)
    console.log('Authenticated user:', req.userId)

    const { title, amount, type, categoryId, date, notes } = req.body

    const newTransaction = new Transaction({
      title,
      amount,
      type,
      categoryId,
      date,
      notes,
      userId: req.userId
    })

    await newTransaction.save()
    res.status(201).json(newTransaction)

  } catch (err: any) {
    console.error('Transaction creation failed:', err)
    res.status(500).json({ message: 'Failed to add transaction' })
  }
}

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId
    console.log('Fetching for userId:', userId)

    const transactions = await Transaction.find({ userId })
      .populate('categoryId') // ✅ This populates category info
      .sort({ createdAt: -1 })

    res.json(transactions)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions' })
  }
}

export const updateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    )

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' })
      return
    }

    res.json(transaction)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update transaction' })
  }
}

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    })

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' })
      return
    }

    res.json({ message: 'Transaction deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete transaction' })
  }
}
export const getTransactionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    })

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' })
      return
    }

    res.json(transaction)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transaction' })
  }
}