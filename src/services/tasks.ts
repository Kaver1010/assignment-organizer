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
    console.log('🔄 Получение всех заданий из базы данных...');
    try {
      const tasks = await query<any[]>(`
        SELECT t.*, s.name as subject_name 
        FROM tasks t
        JOIN subjects s ON t.subject_id = s.id
        ORDER BY t.completed ASC, t.due_date ASC
      `);
      console.log(`✅ Успешно получено ${tasks.length} заданий`);
      console.log('📊 Статистика заданий:', {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        withFiles: tasks.filter(t => t.files?.length > 0).length
      });

      const tasksWithFiles = await Promise.all(
        tasks.map(async (task) => {
          console.log(`🔍 Получение файлов для задания ${task.id}...`);
          const files = await query<TaskFile[]>(
            'SELECT * FROM task_files WHERE task_id = ?',
            [task.id]
          );
          console.log(`📎 Найдено ${files.length} файлов для задания ${task.id}`);
          return {
            ...task,
            dueDate: new Date(task.due_date),
            createdAt: new Date(task.created_at),
            files,
          };
        })
      );

      return tasksWithFiles;
    } catch (error) {
      console.error('❌ Ошибка при получении заданий:', error);
      throw error;
    }
  },

  async createTask(task: Omit<TaskWithFiles, 'id' | 'createdAt' | 'files'>): Promise<string> {
    console.log('➕ Создание нового задания:', task);
    try {
      const id = uuidv4();
      await query(
        `INSERT INTO tasks (id, subject_id, content, due_date, completed)
         VALUES (?, ?, ?, ?, ?)`,
        [id, task.subjectId, task.content, task.dueDate, task.completed]
      );
      console.log('✅ Задание успешно создано с ID:', id);
      return id;
    } catch (error) {
      console.error('❌ Ошибка при создании задания:', error);
      throw error;
    }
  },

  async updateTask(id: string, task: Partial<TaskWithFiles>): Promise<void> {
    console.log('📝 Обновление задания:', { id, updates: task });
    try {
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
      console.log('✅ Задание успешно обновлено');
    } catch (error) {
      console.error('❌ Ошибка при обновлении задания:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    console.log('🗑️ Удаление задания:', id);
    try {
      await query('DELETE FROM tasks WHERE id = ?', [id]);
      console.log('✅ Задание успешно удалено');
    } catch (error) {
      console.error('❌ Ошибка при удалении задания:', error);
      throw error;
    }
  },

  async addFile(taskId: string, fileName: string, filePath: string, fileType: string): Promise<string> {
    console.log('📎 Добавление файла к заданию:', { taskId, fileName });
    try {
      const id = uuidv4();
      await query(
        `INSERT INTO task_files (id, task_id, file_name, file_path, file_type)
         VALUES (?, ?, ?, ?, ?)`,
        [id, taskId, fileName, filePath, fileType]
      );
      console.log('✅ Файл успешно добавлен с ID:', id);
      return id;
    } catch (error) {
      console.error('❌ Ошибка при добавлении файла:', error);
      throw error;
    }
  },

  async removeFile(fileId: string): Promise<void> {
    console.log('🗑️ Удаление файла:', fileId);
    try {
      await query('DELETE FROM task_files WHERE id = ?', [fileId]);
      console.log('✅ Файл успешно удален');
    } catch (error) {
      console.error('❌ Ошибка при удалении файла:', error);
      throw error;
    }
  },

  async getTaskFiles(taskId: string): Promise<TaskFile[]> {
    console.log('🔍 Получение файлов для задания:', taskId);
    try {
      const files = await query<TaskFile[]>(
        'SELECT * FROM task_files WHERE task_id = ?',
        [taskId]
      );
      console.log(`📎 Найдено ${files.length} файлов`);
      return files;
    } catch (error) {
      console.error('❌ Ошибка при получении файлов:', error);
      throw error;
    }
  }
};