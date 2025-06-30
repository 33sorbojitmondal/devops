import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { todoApi } from '../services/api'

// Mock the API
vi.mock('../services/api', () => ({
  todoApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the app title', async () => {
    todoApi.getAll.mockResolvedValue({ data: { data: [] } })
    
    render(<App />)
    
    expect(screen.getByText('DevOps Todo App')).toBeInTheDocument()
    expect(screen.getByText('A demo application for learning DevOps with Git, GitHub Actions, and CI/CD')).toBeInTheDocument()
  })

  test('displays loading state initially', () => {
    todoApi.getAll.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<App />)
    
    expect(screen.getByText('Loading todos...')).toBeInTheDocument()
  })

  test('displays todos after loading', async () => {
    const mockTodos = [
      {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        priority: 'medium',
        created_at: new Date().toISOString()
      }
    ]
    
    todoApi.getAll.mockResolvedValue({ data: { data: mockTodos } })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  test('can add a new todo', async () => {
    const user = userEvent.setup()
    
    todoApi.getAll.mockResolvedValue({ data: { data: [] } })
    todoApi.create.mockResolvedValue({
      data: {
        data: {
          id: 1,
          title: 'New Todo',
          description: 'New Description',
          completed: false,
          priority: 'high',
          created_at: new Date().toISOString()
        }
      }
    })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Todo title...')).toBeInTheDocument()
    })
    
    const titleInput = screen.getByPlaceholderText('Todo title...')
    const descriptionInput = screen.getByPlaceholderText('Description (optional)...')
    const addButton = screen.getByText('Add Todo')
    
    await user.type(titleInput, 'New Todo')
    await user.type(descriptionInput, 'New Description')
    await user.click(addButton)
    
    expect(todoApi.create).toHaveBeenCalledWith({
      title: 'New Todo',
      description: 'New Description',
      priority: 'medium'
    })
  })

  test('displays error message on API failure', async () => {
    todoApi.getAll.mockRejectedValue(new Error('API Error'))
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch todos')).toBeInTheDocument()
    })
  })

  test('displays correct todo stats', async () => {
    const mockTodos = [
      {
        id: 1,
        title: 'Todo 1',
        completed: true,
        priority: 'medium',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Todo 2',
        completed: false,
        priority: 'high',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Todo 3',
        completed: false,
        priority: 'low',
        created_at: new Date().toISOString()
      }
    ]
    
    todoApi.getAll.mockResolvedValue({ data: { data: mockTodos } })
    
    render(<App />)
    
    await waitFor(() => {
      // Total todos
      expect(screen.getByText('3')).toBeInTheDocument()
      // Completed todos
      expect(screen.getByText('1')).toBeInTheDocument()
      // Pending todos  
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  test('shows empty state when no todos', async () => {
    todoApi.getAll.mockResolvedValue({ data: { data: [] } })
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('No todos yet. Create your first todo above!')).toBeInTheDocument()
    })
  })
}) 