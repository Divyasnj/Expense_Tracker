import { Request, Response } from 'express'
import User from '../models/User'
import generateToken from '../utils/generateToken'
import bcrypt from 'bcryptjs'

interface AuthRequest extends Request {
  userId?: string
}
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400).json({ message: 'User already exists' })
    return
  }

  const user = await User.create({ name, email, password })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString())
    })
  } else {
    res.status(400).json({ message: 'Invalid user data' })
  }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  const isMatch = user && await (user as any).matchPassword(password)

  if (user && isMatch) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString())
    })
  } else {
    res.status(401).json({ message: 'Invalid email or password' })
  }
}
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data' })
  }
}
