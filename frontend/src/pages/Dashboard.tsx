import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import TransactionChart from '../components/TransactionChart'

type Transaction = {
  amount: number
  type: 'income' | 'expense'
  categoryId: {
    name: string
    type: 'income' | 'expense'
  }
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    } else {
      fetchUser()
      fetchTransactions()
    }
  }, [navigate])

  const fetchUser = async () => {
    try {
      const res = await api.get('/users/me')
      setUser(res.data)
    } catch (err) {
      console.error('Error fetching user')
    }
  }

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions')
      setTransactions(res.data)
    } catch (err) {
      console.error('Error fetching transactions')
    }
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <>
      <Navbar />
      <div className="p-4 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Welcome, {user?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-green-100 dark:bg-green-800 p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200">Total Income</h3>
            <p className="text-2xl font-bold mt-2">₹{totalIncome}</p>
          </div>
          <div className="bg-red-100 dark:bg-red-800 p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-200">Total Expenses</h3>
            <p className="text-2xl font-bold mt-2">₹{totalExpenses}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-200">Balance</h3>
            <p className="text-2xl font-bold mt-2">₹{balance}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="max-w-5xl mx-auto mt-10">
          <TransactionChart transactions={transactions} />
        </div>
      </div>
    </>
  )
}
