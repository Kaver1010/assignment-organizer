import { Task, TaskFile, TaskWithFiles } from '@/types/task';

const API_URL = '/api';

export const tasksService = {
  async getAllTasks(): Promise<Task[]> {
    console.log('🔄 Загрузка заданий...');
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const tasks: TaskWithFiles[] = await response.json();
      
      // Convert TaskWithFiles to Task
      const convertedTasks: Task[] = tasks.map(task => ({
        id: task.id,
        subject: task.subject_name,
        content: task.content,
        dueDate: new Date(task.dueDate),
        completed: task.completed,
        files: task.files,
        createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
      }));

      console.log('✅ Задания загружены:', convertedTasks);
      return convertedTasks;
    } catch (error) {
      console.error('❌ Ошибка при загрузке заданий:', error);
      throw error;
    }
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
    console.log('➕ Создание нового задания:', task);
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { id } = await response.json();
      console.log('✅ Задание создано с ID:', id);
      return id;
    } catch (error) {
      console.error('❌ Ошибка при создании задания:', error);
      throw error;
    }
  },

  async updateTask(id: string, task: Partial<Task>): Promise<void> {
    console.log('📝 Обновление задания:', { id, updates: task });
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('✅ Задание успешно обновлено');
    } catch (error) {
      console.error('❌ Ошибка при обновлении задания:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    console.log('🗑️ Удаление задания:', id);
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('✅ Задание успешно удалено');
    } catch (error) {
      console.error('❌ Ошибка при удалении задания:', error);
      throw error;
    }
  },
};