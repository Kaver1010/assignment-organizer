import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface TaskFile {
  id: string;
  taskId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  createdAt: Date;
}

export interface TaskWithFiles {
  id: string;
  subjectId: string;
  content: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  files: TaskFile[];
}

export const tasksService = {
  async getAllTasks(): Promise<TaskWithFiles[]> {
    const tasks = await query<any[]>(`
      SELECT t.*, s.name as subject_name 
      FROM tasks t
      JOIN subjects s ON t.subject_id = s.subject_id
      ORDER BY t.completed ASC, t.due_date ASC
    `);

    const tasksWithFiles = await Promise.all(
      tasks.map(async (task) => {
        const files = await query<TaskFile[]>(
          'SELECT * FROM task_files WHERE task_id = ?',
          [task.id]
        );
        return {
          ...task,
          dueDate: new Date(task.due_date),
          createdAt: new Date(task.created_at),
          files,
        };
      })
    );

    return tasksWithFiles;
  },

  async createTask(task: Omit<TaskWithFiles, 'id' | 'createdAt' | 'files'>): Promise<string> {
    const id = uuidv4();
    await query(
      `INSERT INTO tasks (id, subject_id, content, due_date, completed)
       VALUES (?, ?, ?, ?, ?)`,
      [id, task.subjectId, task.content, task.dueDate, task.completed]
    );
    return id;
  },

  async updateTask(id: string, task: Partial<TaskWithFiles>): Promise<void> {
    const updates: string[] = [];
    const values: any[] = [];

    if (task.subjectId) {
      updates.push('subject_id = ?');
      values.push(task.subjectId);
    }
    if (task.content) {
      updates.push('content = ?');
      values.push(task.content);
    }
    if (task.dueDate) {
      updates.push('due_date = ?');
      values.push(task.dueDate);
    }
    if (typeof task.completed !== 'undefined') {
      updates.push('completed = ?');
      values.push(task.completed);
    }

    if (updates.length === 0) return;

    values.push(id);
    await query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  },

  async deleteTask(id: string): Promise<void> {
    await query('DELETE FROM tasks WHERE id = ?', [id]);
  },

  async addFile(taskId: string, fileName: string, filePath: string, fileType: string): Promise<string> {
    const id = uuidv4();
    await query(
      `INSERT INTO task_files (id, task_id, file_name, file_path, file_type)
       VALUES (?, ?, ?, ?, ?)`,
      [id, taskId, fileName, filePath, fileType]
    );
    return id;
  },

  async removeFile(fileId: string): Promise<void> {
    await query('DELETE FROM task_files WHERE id = ?', [fileId]);
  },

  async getTaskFiles(taskId: string): Promise<TaskFile[]> {
    return query<TaskFile[]>(
      'SELECT * FROM task_files WHERE task_id = ?',
      [taskId]
    );
  }
};