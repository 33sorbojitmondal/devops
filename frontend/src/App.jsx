import { useState, useEffect } from 'react'
import { Plus, CheckCircle, Circle, Trash2, Edit3, Save, X } from 'lucide-react'
import { todoApi } from './services/api'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', priority: 'medium' })

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await todoApi.getAll()
      setTodos(response.data.data)
      setError('')
    } catch (err) {
      setError('Failed to fetch todos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newTodo.title.trim()) return

    try {
      const response = await todoApi.create(newTodo)
      setTodos([response.data.data, ...todos])
      setNewTodo({ title: '', description: '', priority: 'medium' })
      setError('')
    } catch (err) {
      setError('Failed to create todo')
      console.error(err)
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      const response = await todoApi.update(id, { completed: !completed })
      setTodos(todos.map(todo => 
        todo.id === id ? response.data.data : todo
      ))
    } catch (err) {
      setError('Failed to update todo')
      console.error(err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await todoApi.delete(id)
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err) {
      setError('Failed to delete todo')
      console.error(err)
    }
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority
    })
  }

  const saveEdit = async () => {
    try {
      const response = await todoApi.update(editingId, editForm)
      setTodos(todos.map(todo => 
        todo.id === editingId ? response.data.data : todo
      ))
      setEditingId(null)
      setError('')
    } catch (err) {
      setError('Failed to update todo')
      console.error(err)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ title: '', description: '', priority: 'medium' })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">DevOps Todo App</h1>
          <p className="text-gray-600">A demo application for learning DevOps with Git, GitHub Actions, and CI/CD</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Add Todo Form */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Todo title..."
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Description (optional)..."
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                className="input h-20 resize-none"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                className="input w-32"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="submit" className="btn btn-primary flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Todo</span>
              </button>
            </div>
          </form>
        </div>

        {/* Todo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-2xl font-bold text-blue-600">{todos.length}</div>
            <div className="text-gray-600">Total Todos</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-green-600">
              {todos.filter(todo => todo.completed).length}
            </div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-orange-600">
              {todos.filter(todo => !todo.completed).length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500 text-lg">No todos yet. Create your first todo above!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="card p-4">
                {editingId === todo.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="input"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="input h-20 resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <select
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                        className="input w-32"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <div className="flex space-x-2">
                        <button onClick={saveEdit} className="btn btn-primary">
                          <Save size={16} />
                        </button>
                        <button onClick={cancelEdit} className="btn btn-secondary">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleComplete(todo.id, todo.completed)}
                      className="mt-1 text-blue-600 hover:text-blue-800"
                    >
                      {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-lg font-medium ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {todo.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                      </div>
                      {todo.description && (
                        <p className={`text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                          {todo.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Created: {new Date(todo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(todo)}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>Built with React, Node.js, and ❤️ for learning DevOps</p>
        </div>
      </div>
    </div>
  )
}

export default App 