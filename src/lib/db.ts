import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '65.108.73.224',
  port: 3306,
  user: 'u658_roYlx2rdbI',
  password: 'k+h!j2ClwYI.5jMs9znZE0eL',
  database: 's658_storage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// SQL для создания необходимых таблиц
const createTables = async () => {
  // Таблица предметов
  await query(`
    CREATE TABLE IF NOT EXISTS subjects (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `);

  // Таблица заданий
  await query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(36) PRIMARY KEY,
      subject_id VARCHAR(36) NOT NULL,
      content TEXT NOT NULL,
      due_date DATETIME NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )
  `);

  // Таблица файлов
  await query(`
    CREATE TABLE IF NOT EXISTS task_files (
      id VARCHAR(36) PRIMARY KEY,
      task_id VARCHAR(36) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      file_type VARCHAR(50) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    )
  `);
};

// Инициализация таблиц при запуске приложения
createTables().catch(console.error);

export default pool;