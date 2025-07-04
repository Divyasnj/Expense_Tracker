import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

type FormData = {
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  notes?: string
}

export default function EditTransaction() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm<FormData>()

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      const data = res.data
      reset({
        ...data,
        date: data.date?.substring(0, 10), // format YYYY-MM-DD
      })
    }
    fetchData()
  }, [id, reset])

  const onSubmit = async (data: FormData) => {
    try {
      await api.put(`/transactions/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      alert('Transaction updated!')
      navigate('/history') // or redirect to dashboard
    } catch (err) {
      alert('Update failed')
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-8 p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Transaction</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('title')} placeholder="Title" className="w-full p-2 border rounded" />
          <input type="number" {...register('amount')} placeholder="Amount" className="w-full p-2 border rounded" />
          <select {...register('type')} className="w-full p-2 border rounded">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select {...register('category')} className="w-full p-2 border rounded">
            <option value="food">Food</option>
            <option value="salary">Salary</option>
            <option value="transport">Transport</option>
          </select>
          <input type="date" {...register('date')} className="w-full p-2 border rounded" />
          <textarea {...register('notes')} placeholder="Notes (optional)" className="w-full p-2 border rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Update</button>
        </form>
      </div>
    </>
  )
}
