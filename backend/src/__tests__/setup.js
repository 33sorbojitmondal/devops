const { initializeDatabase, closeDatabase, TodoRepository } = require('../database/database');

// Global test setup
beforeAll(async () => {
  console.log('🧪 Setting up test database...');
  await initializeDatabase();
  console.log('✅ Test database initialized');
});

// Global test cleanup
afterAll(async () => {
  console.log('🧹 Cleaning up test database...');
  await closeDatabase();
  console.log('✅ Test database closed');
});

// Reset database between test suites for isolation
beforeEach(async () => {
  // Clear all todos before each test for complete isolation
  try {
    await TodoRepository.deleteAll();
  } catch (error) {
    // Ignore errors if table doesn't exist yet
    console.log('Note: Could not clear todos (table may not exist yet)');
  }
}); 