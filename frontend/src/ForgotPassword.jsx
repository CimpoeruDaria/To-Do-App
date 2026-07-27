import React, { useState } from 'react'
import './ForgotPassword.css'

function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [isFlippingBack, setIsFlippingBack] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()

    try {
      // Trimitem cererea de verificare către API-ul din Python
      const response = await fetch('http://127.0.0.1:8000/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        alert(`Un link de resetare a fost trimis la adresa: ${email}`)
        handleNavigateToLogin()
      } else {
        alert(data.detail || "A apărut o eroare la verificarea emailului.")
      }
    } catch (error) {
      alert("Eroare de rețea. Asigură-te că serverul backend este pornit!")
    }
  }

  // Animație fluidă la întoarcerea spre Login
  const handleNavigateToLogin = () => {
    setIsFlippingBack(true)
    setTimeout(() => {
      onNavigate('login')
    }, 450)
  }

  return (
    <div className="forgot-container">
      <div className={`card-forgot ${isFlippingBack ? 'flipping-back' : ''}`}>
        <div className="forgot-header">
          <h2 className="forgot-title">RECOVER PASSWORD</h2>
          <p className="forgot-subtitle">
            Enter your account email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleReset} className="forgot-form">
          <div className="form-group">
            <label className="form-label">E-mail Address</label>
            <input 
              type="email" 
              placeholder="adress@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="form-input" 
            />
          </div>

          <button type="submit" className="reset-btn">
            Send Reset Link
          </button>
        </form>

        <div className="back-to-login-container">
          <button 
            type="button" 
            onClick={handleNavigateToLogin} 
            className="back-btn"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword