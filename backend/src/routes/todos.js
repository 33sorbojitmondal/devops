const express = require('express');
const Joi = require('joi');
const { TodoRepository } = require('../database/database');

const router = express.Router();

// Validation schemas
const todoSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(1000).allow(''),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium')
});

const updateTodoSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().max(1000).allow(''),
  completed: Joi.boolean(),
  priority: Joi.string().valid('low', 'medium', 'high')
});

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await TodoRepository.findAll();
    res.json({
      success: true,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todos'
    });
  }
});

// GET /api/todos/:id - Get a specific todo
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID'
      });
    }

    const todo = await TodoRepository.findById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todo'
    });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const { error, value } = todoSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const newTodo = await TodoRepository.create(value);
    
    res.status(201).json({
      success: true,
      data: newTodo,
      message: 'Todo created successfully'
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create todo'
    });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID'
      });
    }

    const { error, value } = updateTodoSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const updatedTodo = await TodoRepository.update(id, value);
    
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.json({
      success: true,
      data: updatedTodo,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update todo'
    });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID'
      });
    }

    const deleted = await TodoRepository.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete todo'
    });
  }
});

// DELETE /api/todos - Delete all todos (for testing/reset)
router.delete('/', async (req, res) => {
  try {
    const count = await TodoRepository.deleteAll();
    
    res.json({
      success: true,
      message: `Deleted ${count} todos`,
      deletedCount: count
    });
  } catch (error) {
    console.error('Error deleting all todos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete todos'
    });
  }
});

module.exports = router; 