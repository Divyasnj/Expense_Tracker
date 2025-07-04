// backend/src/routes/transactionRoutes.ts
import express from 'express'
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionById
} from '../controllers/transactionController'

import { protect } from '../middlewares/authMiddleware'


const router = express.Router()
router.get('/', protect, getTransactions)
router.get('/:id', protect, getTransactionById) 
router.post('/', protect, createTransaction)
router.put('/:id', protect, updateTransaction)
router.delete('/:id', protect, deleteTransaction)

// 👈 Add this

export default router
