import express from 'express'
import { registerUser, loginUser, getMe } from '../controllers/userControllers'
import { protect } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

// ✅ Add this route to get logged-in user's info
router.get('/me', protect, getMe)

export default router
