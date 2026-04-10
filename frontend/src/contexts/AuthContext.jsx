import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [user, setUser] = useState(localStorage.getItem('username'))
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (credentials) => api.post('/login/', credentials),
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.access)
      localStorage.setItem('role', data.data.role)
      localStorage.setItem('username', data.data.username)
      setToken(data.data.access)
      setRole(data.data.role)
      setUser(data.data.username)
    }
  })

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
    setToken(null)
    setRole(null)
    setUser(null)
    queryClient.clear()
  }

  const value = {
    token,
    role,
    user,
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    logout,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

