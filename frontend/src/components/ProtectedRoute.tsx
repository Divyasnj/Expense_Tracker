// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  children: ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem('token')
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default ProtectedRoute
