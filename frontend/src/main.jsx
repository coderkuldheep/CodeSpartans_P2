import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Suppliers from './pages/Suppliers.jsx'
import Purchases from './pages/Purchases.jsx'
import Sales from './pages/Sales.jsx'
import Production from './pages/Production.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

const basename = '/CodeSpartans_P2'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div className="p-8 text-center text-destructive font-medium">Something went wrong!</div>,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'suppliers',
        element: <Suppliers />,
      },
      {
        path: 'purchases',
        element: <Purchases />,
      },
      {
        path: 'sales',
        element: <Sales />,
      },
      {
        path: 'production',
        element: <Production />,
      },
    ],
  },
], { basename })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

