import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router'
import { AuthProvider } from './components/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </React.StrictMode>,
)
