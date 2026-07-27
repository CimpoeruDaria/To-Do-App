import React, { useState, useEffect } from 'react'
import './MainPage.css'

function MainPage({ user, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskDeadline, setNewTaskDeadline] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks?user_id=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Eroare la preluarea task-urilor:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTaskText.trim()) return

    const payload = {
      user_id: user?.id,
      text: newTaskText,
      deadline: newTaskDeadline ? newTaskDeadline : null
    }

    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const savedTask = await response.json()
        setTasks([...tasks, savedTask])
        setNewTaskText('')
        setNewTaskDeadline('')
      }
    } catch (error) {
      console.error('Eroare la adăugarea task-ului:', error)
    }
  }

  const toggleTask = async (id, currentCompleted) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentCompleted })
      })

      if (response.ok) {
        setTasks(
          tasks.map((t) => (t.id === id ? { ...t, completed: !currentCompleted } : t))
        )
      }
    } catch (error) {
      console.error('Eroare la actualizarea task-ului:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== id))
      }
    } catch (error) {
      console.error('Eroare la ștergerea task-ului:', error)
    }
  }

  return (
    <div className="full-mainpage-container">
      {/* HEADER: Sus-stânga (Titlul) & Sus-dreapta (Logout) */}
      <header className="top-navbar">
        <div className="welcome-title-group">
          <span className="welcome-sub">WELCOME, </span>
          <h1 className="welcome-username">{user?.username || 'UTILIZATOR'}</h1>
        </div>
        
        <button onClick={onLogout} className="logout-top-btn">
          Ieși din cont 🚪
        </button>
      </header>

      {/* ZONA CENTRALĂ: Formular + Lista de Task-uri */}
      <main className="center-content">
        <div className="tasks-wrapper">
          {/* Formular adăugare task */}
          <form onSubmit={handleAddTask} className="add-task-bar">
            <input
              type="text"
              placeholder="Scrie o nouă sarcină în jurnal..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="task-input-field"
            />
            
            <input
              type="date"
              value={newTaskDeadline}
              onChange={(e) => setNewTaskDeadline(e.target.value)}
              className="task-date-picker"
              title="Alege o dată limită (opțional)"
            />

            <button type="submit" className="task-add-btn">
              + Adaugă
            </button>
          </form>

          {/* Secțiune Listă */}
          <div className="tasks-list-section">
            <h2 className="list-title">Task-urile tale</h2>

            {loading ? (
              <p className="status-msg">Se încarcă sarcinile...</p>
            ) : tasks.length === 0 ? (
              <p className="status-msg">Nu ai nicio sarcină adăugată. Începe prin a scrie una mai sus!</p>
            ) : (
              <ul className="full-task-list">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`full-task-item ${task.completed ? 'completed' : ''}`}
                  >
                    <label className="checkbox-box">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id, task.completed)}
                      />
                    </label>

                    <div className="task-details">
                      <span className="task-text-body">{task.text}</span>
                      {task.deadline ? (
                        <span className="task-date-tag">📅 {task.deadline}</span>
                      ) : (
                        <span className="task-no-date">Fără deadline</span>
                      )}
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete-btn"
                      title="Șterge task-ul"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MainPage