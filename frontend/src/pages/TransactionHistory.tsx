import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type Transaction = {
  _id: string
  title: string
  amount: number
  type: string
  categoryId: {
    _id: string
    name: string
    type: 'income' | 'expense'
  }
  date: string
  notes?: string
}

type Category = {
  _id: string
  name: string
  type: 'income' | 'expense'
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filtered, setFiltered] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setTransactions(res.data)
      } catch (err: any) {
        console.error('Error fetching transactions:', err.response?.data || err.message)
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(res.data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchTransactions()
    fetchCategories()
  }, [])

  useEffect(() => {
    let result = [...transactions]

    if (categoryFilter) {
      result = result.filter(tx => tx.categoryId?.name === categoryFilter)
    }

    if (startDate) {
      result = result.filter(tx => new Date(tx.date) >= new Date(startDate))
    }

    if (endDate) {
      result = result.filter(tx => new Date(tx.date) <= new Date(endDate))
    }

    setFiltered(result)
  }, [transactions, categoryFilter, startDate, endDate])

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      alert('Transaction deleted!')
      setTransactions((prev) => prev.filter((tx) => tx._id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete')
    }
  }

  const exportToCSV = () => {
    const csv = Papa.unparse(
      filtered.map(tx => ({
        Title: tx.title,
        Amount: tx.amount,
        Type: tx.type,
        Category: tx.categoryId?.name,
        Date: new Date(tx.date).toLocaleDateString(),
        Notes: tx.notes || ''
      }))
    )
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'transactions.csv')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const tableData = filtered.map(tx => [
      tx.title,
      tx.amount,
      tx.type,
      tx.categoryId?.name,
      new Date(tx.date).toLocaleDateString(),
      tx.notes || ''
    ])

    autoTable(doc, {
      head: [['Title', 'Amount', 'Type', 'Category', 'Date', 'Notes']],
      body: tableData
    })

    doc.save('transactions.pdf')
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8 p-4 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>
                {cat.name} ({cat.type})
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export CSV
          </button>

          <button
            onClick={exportToPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export PDF
          </button>
        </div>

        {filtered.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((tx) => (
              <li key={tx._id} className="border p-4 rounded shadow dark:bg-gray-800 dark:border-gray-700">
                <p><strong>{tx.title}</strong> — ₹{tx.amount} ({tx.type})</p>
                <p>Category: {tx.categoryId?.name} ({tx.categoryId?.type})</p>
                <p>Date: {new Date(tx.date).toLocaleDateString()}</p>
                {tx.notes && <p>Note: {tx.notes}</p>}

                <div className="mt-2 space-x-4">
                  <Link
                    to={`/edit/${tx._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
