// backend/src/routes/categoryRoutes.ts
import express from 'express'
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController'

import { protect } from '../middlewares/authMiddleware'

const router = express.Router()

router.get('/', protect, getCategories)
router.post('/', protect, createCategory)
router.put('/:id', protect, updateCategory)
router.delete('/:id', protect, deleteCategory)

export default router
