const request = require('supertest');
const app = require('../server');
const { closeDatabase } = require('../database/database');

describe('Server Tests', () => {
  afterAll(async () => {
    await closeDatabase();
  });

  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Todo API', () => {
    test('GET /api/todos should return todos list', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('POST /api/todos should create a new todo', async () => {
      const newTodo = {
        title: 'Test Todo',
        description: 'This is a test todo',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(201);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('title', newTodo.title);
      expect(response.body.data).toHaveProperty('description', newTodo.description);
      expect(response.body.data).toHaveProperty('priority', newTodo.priority);
    });

    test('POST /api/todos should validate required fields', async () => {
      const invalidTodo = {
        description: 'Todo without title'
      };

      await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .expect(400);
    });

    test('GET /api/todos/:id should return specific todo', async () => {
      // First create a todo
      const newTodo = {
        title: 'Test Todo for GET',
        description: 'Test description',
        priority: 'high'
      };

      const createResponse = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(201);

      const todoId = createResponse.body.data.id;

      // Then get it
      const getResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);

      expect(getResponse.body).toHaveProperty('success', true);
      expect(getResponse.body.data).toHaveProperty('id', todoId);
      expect(getResponse.body.data).toHaveProperty('title', newTodo.title);
    });

    test('GET /api/todos/:id should return 404 for non-existent todo', async () => {
      await request(app)
        .get('/api/todos/999999')
        .expect(404);
    });
  });

  describe('Error Handling', () => {
    test('Should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/non-existent-route')
        .expect(404);
    });
  });
}); 