import React, { useState } from 'react'

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
        alert(data.mesaj || "Account created successfully! ")

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
    <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-purple-100/20 text-left">
      <h2 className="text-purple-950 text-4xl font-black tracking-tight text-center mb-2">Creează un cont </h2>
      <p className="text-gray-500 text-sm text-center mb-6">Create an account</p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider mb-1 ml-1">Nume Complet</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm" placeholder="Andrei Ionescu" />
          </div>
          <div>
            <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider mb-1 ml-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm" placeholder="andrei@email.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider mb-1 ml-1">Parolă</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition text-sm" placeholder="••••••••" />
          </div>
        </div>

        <button type="submit" className="save-button">
          Create account 
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <button onClick={() => onNavigate('login')} className="text-purple-900 font-bold hover:underline bg-transparent border-none cursor-pointer">
          Login
        </button>
      </p>
    </div>
  )
}

export default Register