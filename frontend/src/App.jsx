import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import MainPage from './MainPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [user, setUser] = useState(null)

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setCurrentPage('mainpage')
  }

  const handleRegisterSuccess = (userData) => {
    setUser(userData)
    setCurrentPage('mainpage')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('login')
  }

  return (
    <div className="app-container">
      {/* 1. Pagina de Login */}
      {currentPage === 'login' && (
        <Login 
          onNavigate={setCurrentPage} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
      
      {/* 2. Pagina de Register */}
      {currentPage === 'register' && (
        <Register 
          onNavigate={setCurrentPage} 
          onRegisterSuccess={handleRegisterSuccess} 
        />
      )}

      {/* 3. Pagina de Recuperare Parolă */}
      {currentPage === 'forgot-password' && (
        <ForgotPassword 
          onNavigate={setCurrentPage} 
        />
      )}

      {/* 4. Pagina Principală (Jurnalul) */}
      {currentPage === 'mainpage' && (
        <MainPage 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  )
}

export default App
