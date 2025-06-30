const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.join(__dirname, '../../data/todos.db');

let db = null;

// Get database instance
function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        throw err;
      }
      console.log(`Connected to SQLite database at ${DB_PATH}`);
    });
  }
  return db;
}

// Initialize database with tables
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.serialize(() => {
      // Create todos table
      database.run(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          completed BOOLEAN DEFAULT 0,
          priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating todos table:', err);
          reject(err);
        } else {
          console.log('Todos table created or already exists');
          resolve();
        }
      });
    });
  });
}

// Close database connection
function closeDatabase() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
    db = null;
  }
}

// Database operations
class TodoRepository {
  static async findAll() {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      database.all(
        'SELECT * FROM todos ORDER BY created_at DESC',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              ...row,
              completed: Boolean(row.completed)
            })));
          }
        }
      );
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      database.get(
        'SELECT * FROM todos WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? { ...row, completed: Boolean(row.completed) } : null);
          }
        }
      );
    });
  }

  static async create(todo) {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      const { title, description, priority = 'medium' } = todo;
      
      database.run(
        `INSERT INTO todos (title, description, priority) 
         VALUES (?, ?, ?)`,
        [title, description, priority],
        function(err) {
          if (err) {
            reject(err);
          } else {
            TodoRepository.findById(this.lastID)
              .then(resolve)
              .catch(reject);
          }
        }
      );
    });
  }

  static async update(id, updates) {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      const fields = [];
      const values = [];
      
      Object.keys(updates).forEach(key => {
        if (['title', 'description', 'completed', 'priority'].includes(key)) {
          fields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      });
      
      if (fields.length === 0) {
        return TodoRepository.findById(id).then(resolve).catch(reject);
      }
      
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      database.run(
        `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`,
        values,
        function(err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            resolve(null);
          } else {
            TodoRepository.findById(id)
              .then(resolve)
              .catch(reject);
          }
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      database.run(
        'DELETE FROM todos WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  static async deleteAll() {
    return new Promise((resolve, reject) => {
      const database = getDatabase();
      database.run(
        'DELETE FROM todos',
        [],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes);
          }
        }
      );
    });
  }
}

module.exports = {
  getDatabase,
  initializeDatabase,
  closeDatabase,
  TodoRepository
}; 