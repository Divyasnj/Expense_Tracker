import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import NotFound from './pages/NotFound';
import TransactionHistory from './pages/TransactionHistory';
import ProtectedRoute from './components/ProtectedRoute';
import EditTransaction from './pages/EditTransaction';
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';

import Categories from './pages/Categories';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* 🏠 Landing Page or Dashboard */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
        />

        {/* 🔓 Public Routes - block access if already logged in */}
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditTransaction />
            </ProtectedRoute>
          }
        />
        <Route
  path="/categories"
  element={
    <ProtectedRoute>
      <Categories />
    </ProtectedRoute>
  }
/>


        {/* ❓ 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
