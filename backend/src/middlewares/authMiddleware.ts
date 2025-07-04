import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
// At the top of authMiddleware.ts




interface AuthRequest extends Request {
  userId?: string
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    req.userId = decoded.id // ✅ This will now NOT throw an error
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token validation failed' })
  }
}