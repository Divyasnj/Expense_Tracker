import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Add this

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [serverError, setServerError] = useState('');
  const { user } = useAuth(); // ✅ Check if already logged in

  // ✅ Redirect if user is already logged in
  if (user) return <Navigate to="/dashboard" />;

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await api.post('/users/register', data);
      alert('Registration successful!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setServerError(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Register</h2>

        <input
          {...register('name', { required: 'Name is required' })}
          placeholder="Name"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email format',
            },
          })}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {serverError && (
          <div className="text-red-600 text-sm text-center">
            {serverError}
            {serverError.toLowerCase().includes('exist') && (
              <p>
                Already registered?{' '}
                <Link to="/login" className="text-blue-600 underline">
                  Login here
                </Link>
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-600">
          Already registered?{' '}
          <Link to="/login" className="text-blue-600 underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
