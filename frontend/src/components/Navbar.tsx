import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">💸 Expense Tracker</h1>

        {/* Hamburger for mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/add" className="hover:underline">Add</Link>
          <Link to="/transactions" className="hover:underline">History</Link>
          <Link to="/categories" className="hover:underline">Categories</Link>
          <button
            onClick={toggleTheme}
            className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col gap-3 mt-3 md:hidden">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/add" className="hover:underline">Add</Link>
          <Link to="/transactions" className="hover:underline">History</Link>
          <Link to="/categories" className="hover:underline">Categories</Link>
          <button
            onClick={toggleTheme}
            className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 w-fit"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded w-fit"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
