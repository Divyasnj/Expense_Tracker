import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'
import userRoutes from './routes/userRoutes'
import transactionRoutes from './routes/transactionRoutes'
import categoryRoutes from './routes/categoryRoutes'




dotenv.config()
connectDB()

const app = express()

// ✅ Middlewares


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json()) // <-- THIS IS REQUIRED

// ✅ Routes
app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/categories', categoryRoutes)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
