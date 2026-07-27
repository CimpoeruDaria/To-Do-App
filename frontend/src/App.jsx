import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [user, setUser] = useState(null)

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setCurrentPage('dashboard')
  }

  const handleRegisterSuccess = (userData) => {
    setUser(userData)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('login')
  }

  return (
    <div className="app-container">
      {currentPage === 'login' && (
        <Login onNavigate={setCurrentPage} onLoginSuccess={handleLoginSuccess} />
      )}
      
      {currentPage === 'register' && (
        <Register onNavigate={setCurrentPage} onRegisterSuccess={handleRegisterSuccess} />
      )}
    </div>
  )
}

export default App