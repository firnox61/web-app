import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const remainingCount = tasks.filter((task) => !task.completed).length

  function addTask(event) {
    event.preventDefault()

    const title = newTask.trim()
    if (!title) return

    setTasks([...tasks, { id: Date.now(), title, completed: false }])
    setNewTask('')
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function startEditing(task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  function updateTask(event) {
    event.preventDefault()

    const title = editingTitle.trim()
    if (!title) return

    setTasks(
      tasks.map((task) =>
        task.id === editingId ? { ...task, title } : task,
      ),
    )
    setEditingId(null)
    setEditingTitle('')
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingTitle('')
  }

  return (
    <main className="container py-5" style={{ maxWidth: '720px' }}>
      <h1 className="mb-2">Yapılacaklar Listem</h1>
      <p className="text-secondary mb-4">
        Görevlerini ekle ve düzenli kal.
      </p>

      <form className="d-flex gap-2 mb-3" onSubmit={addTask}>
        <input
          className="form-control"
          type="text"
          placeholder="Yeni bir görev yaz..."
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Ekle
        </button>
      </form>

      <p className="small text-secondary mb-4">
        {remainingCount} görev kaldı
      </p>

      {tasks.length === 0 ? (
        <p className="text-secondary">Henüz görev eklemedin.</p>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li
              className="list-group-item d-flex align-items-center gap-2"
              key={task.id}
            >
              {editingId === task.id ? (
                <form
                  className="d-flex flex-grow-1 gap-2"
                  onSubmit={updateTask}
                >
                  <input
                    className="form-control"
                    value={editingTitle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                    autoFocus
                  />
                  <button className="btn btn-success" type="submit">
                    Kaydet
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={cancelEditing}
                  >
                    İptal
                  </button>
                </form>
              ) : (
                <>
                  <input
                    className="form-check-input mt-0"
                    type="checkbox"
                    checked={Boolean(task.completed)}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`${task.title} görevini tamamlandı olarak işaretle`}
                  />
                  <span
                    className="flex-grow-1"
                    style={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#6c757d' : 'inherit',
                    }}
                  >
                    {task.title}
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    type="button"
                    onClick={() => startEditing(task)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    type="button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Sil
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App