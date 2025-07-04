import { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import { useForm } from 'react-hook-form'

interface Category {
  _id: string
  name: string
  type: 'income' | 'expense'
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset } = useForm<{ name: string; type: 'income' | 'expense' }>()

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (error) {
      console.error('Failed to fetch categories', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: { name: string; type: 'income' | 'expense' }) => {
    const normalizedName = data.name.trim().toLowerCase()

    const duplicate = categories.find(
      (cat) =>
        cat.name.trim().toLowerCase() === normalizedName &&
        cat.type === data.type
    )

    if (duplicate) {
      alert('This category already exists.')
      return
    }

    try {
      await api.post('/categories', data)
      fetchCategories()
      reset()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add category')
      console.error('Failed to add category', error)
    }
  }

  const deleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return

    try {
      await api.delete(`/categories/${id}`)
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-8 p-6 border rounded shadow bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

        {/* Add Category Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-6">
          <input {...register('name', { required: true })} placeholder="Category Name" className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" />

          <select {...register('type')} className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Category
          </button>
        </form>

        {/* List of Categories */}
        <h3 className="text-xl font-semibold mb-2">Your Categories:</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat._id} className="flex justify-between items-center border p-2 rounded dark:bg-gray-800 dark:border-gray-700">
                <div>
                  <strong>{cat.name}</strong>{' '}
                  <span className="text-sm text-gray-500 dark:text-gray-300">({cat.type})</span>
                </div>
                <button
                  onClick={() => deleteCategory(cat._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
