import React, { useState } from 'react'

function Login({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        const serverUser = data.user;
        const loggedInUser = {
          id: serverUser.id,
          fullName: serverUser.name          
        }
        onLoginSuccess(loggedInUser) 
      } else {
        alert(data.detail || "Wrong e-mail or password!")
      }
    } catch (error) {
      console.error(error)
      alert("Cannot connect to Python server!")
    }
  }

  return (
    <div className="login-container">
      <div 
        className={`notebook ${isOpen ? 'open' : ''}`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {/* JOURNAL COVER */}
        <div className="notebook-cover">
          <div className="notebook-cover-inner"></div>
          <div className="cover-design">          
            <span>Tasks Journal</span>
            <p className="click-hint">Click to open</p>
          </div>
        </div>

        {/* LOGIN SECTION */}
        <div className="notebook-inside">
          <div className="card-login">
            <h2 className="login-title">CONNECT TO YOUR LIST</h2>

            <form onSubmit={handleLogin}>
              <div>
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

              <div>
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex' }}>
                <button 
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="forgot-btn"
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="login-btn"> Login into account </button>
            </form>

            <div className="create-account-container">
              <span>New here?</span>
              <button 
                type="button"
                onClick={() => onNavigate('register')}
                className="create-account-btn"
              >
                Create an account for free
              </button>
            </div>

            <button 
              type="button" 
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              Close the journal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
