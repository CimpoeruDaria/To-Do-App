import React, { useState } from 'react'
import './Register.css'

function Register({ onNavigate, onRegisterSuccess }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        })
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        alert(data.mesaj || "Account created successfully!")

        const loggedInUser = {
          id: data.user_id,
          username: username
        }
        
        onRegisterSuccess(loggedInUser) 
      } else {
        alert(data.detail || "Eroare la înregistrare!")
      }
    } catch (error) {
      console.error(error)
      alert("Eroare de rețea. Asigură-te că serverul Python rulează!")
    }
  }

  return (
    <div className="register-container">
      <div className="card-register">
        <h2 className="register-title">CREATE AN ACCOUNT</h2>
        <p className="register-subtitle">Start organizing your tasks today</p>

        <form onSubmit={handleRegister} className="register-form">
          <div>
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="form-input" 
              placeholder="Walter White" 
            />
          </div>

          <div>
            <label className="form-label">E-mail Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="form-input" 
              placeholder="adress@email.com" 
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-input" 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="register-btn">
            Create account 
          </button>
        </form>

        <div className="login-redirect-container">
          <span>Already have an account?</span>
          <button 
            type="button" 
            onClick={() => onNavigate('login')} 
            className="login-redirect-btn"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
