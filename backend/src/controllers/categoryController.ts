// backend/src/controllers/categoryController.ts
import { Request, Response } from 'express'
import Category from '../models/categoryModel'

interface AuthRequest extends Request {
  userId?: string
}

export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ userId: req.userId })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' })
  }
}

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, type } = req.body

    const newCategory = await Category.create({ name, type, userId: req.userId })
    res.status(201).json(newCategory)
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Category already exists' })
    } else {
      console.error('Category creation error:', err)
      res.status(500).json({ message: 'Failed to create category' })
    }
  }
}

export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    )

    if (!category) {
      res.status(404).json({ message: 'Category not found' })
      return
    }

    res.json(category)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category' })
  }
}

export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    })

    if (!category) {
      res.status(404).json({ message: 'Category not found' })
      return
    }

    res.json({ message: 'Category deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category' })
  }
}
