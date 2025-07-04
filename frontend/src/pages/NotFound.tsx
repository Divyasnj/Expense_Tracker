export default function NotFound() {
  console.log("⚠️ 404 Page Rendered")

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
      <a href="/login" className="mt-6 text-blue-500 underline">Go to Login</a>
    </div>
  )
}
