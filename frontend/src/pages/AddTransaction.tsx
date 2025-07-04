import { useForm, useWatch } from 'react-hook-form'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import { useEffect, useState } from 'react'

type TransactionForm = {
  title: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  date: string
  notes?: string
}

type Category = {
  _id: string
  name: string
  type: 'income' | 'expense'
}

export default function AddTransaction() {
  const { register, handleSubmit, reset, control } = useForm<TransactionForm>({
    defaultValues: {
      type: 'income'
    }
  })
  const [categories, setCategories] = useState<Category[]>([])
  const selectedType = useWatch({ control, name: 'type' })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/categories', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setCategories(res.data)
      } catch (error) {
        console.error('Failed to fetch categories', error)
      }
    }

    fetchCategories()
  }, [selectedType]) // ✅ Re-fetch or trigger update when type changes

  const onSubmit = async (data: TransactionForm) => {
    console.log('Transaction sending:', data)

    try {
      const token = localStorage.getItem('token')

      const res = await api.post('/transactions', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      alert('Transaction submitted successfully!')
      reset()
      console.log('Transaction response:', res.data)
    } catch (error: any) {
      console.error('Transaction error:', error)
      alert(error.response?.data?.message || 'Failed to submit transaction')
    }
  }

  const filteredCategories = categories.filter(cat => cat.type === selectedType)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white p-6">
        <div className="max-w-xl mx-auto mt-8 p-6 border rounded-lg shadow-md bg-white text-black dark:bg-gray-900 dark:text-white">
          <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register('title', { required: true })} placeholder="Title" className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" />

            <input type="number" {...register('amount', { required: true })} placeholder="Amount" className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" />

            <select {...register('type')} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select {...register('categoryId', { required: true })} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <option value="">Select Category</option>
              {filteredCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input type="date" {...register('date', { required: true })} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" />

            <textarea {...register('notes')} placeholder="Notes (optional)" className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" />

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Transaction</button>
          </form>
        </div>
      </div>
    </>
  )
}
