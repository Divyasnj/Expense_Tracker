import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

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

  // ✅ Redirect to dashboard if already logged in
  if (user) return <Navigate to="/dashboard" />;

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/users/login', data);
      setUser(res.data.user); // store user in context
      localStorage.setItem('user', JSON.stringify(res.data.user)); // persist user
      localStorage.setItem('token', res.data.token); // persist token
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <input
          {...register('email', { required: true })}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

        <input
          {...register('password', { required: true })}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">Password is required</p>}

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
