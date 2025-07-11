import { FaEye, FaEyeSlash } from 'react-icons/fa';


import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  if (user) return <Navigate to="/dashboard" />;

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/users/login', data);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <input
          {...register('email', { required: true })}
          placeholder="Email"
          className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

        {/* Password Field with Eye Toggle */}
        <div className="relative">
          <input
            {...register('password', { required: true })}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full border p-2 pr-10 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-2.5 right-2 text-gray-600 dark:text-gray-300"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">Password is required</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}
