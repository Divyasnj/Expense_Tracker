import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-500 px-4">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-xl text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Expense Tracker</h1>
        <p className="text-gray-600 text-lg mb-6">
          Track your expenses, manage income, and gain insights into your finances — all in one app.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow">
              Get Started
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-6 rounded-lg shadow">
              Login
            </button>
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-6">Made with ❤️ by Divya</p>
      </div>
    </div>
  );
}
