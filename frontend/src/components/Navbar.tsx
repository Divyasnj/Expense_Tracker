// src/components/Navbar.tsx
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center dark:bg-gray-900">
      <h1 className="text-xl font-semibold">💸 Expense Tracker</h1>
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/add" className="hover:underline">Add</Link>
        <Link to="/transactions" className="hover:underline">History</Link>
        <Link to="/categories" className="hover:underline">Categories</Link>
        <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
