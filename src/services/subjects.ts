import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface Subject {
  id: string;
  name: string;
}

export const subjectsService = {
  async getAllSubjects(): Promise<Subject[]> {
    console.log('🔄 Получение всех предметов...');
    try {
      const subjects = await query<Subject[]>('SELECT * FROM subjects ORDER BY name');
      console.log(`✅ Успешно получено ${subjects.length} предметов`);
      return subjects;
    } catch (error) {
      console.error('❌ Ошибка при получении предметов:', error);
      throw error;
    }
  },

  async createSubject(name: string): Promise<string> {
    console.log('➕ Создание нового предмета:', name);
    try {
      const id = uuidv4();
      await query(
        'INSERT INTO subjects (id, name) VALUES (?, ?)',
        [id, name]
      );
      console.log('✅ Предмет успешно создан с ID:', id);
      return id;
    } catch (error) {
      console.error('❌ Ошибка при создании предмета:', error);
      throw error;
    }
  },

  async updateSubject(id: string, name: string): Promise<void> {
    console.log('📝 Обновление предмета:', { id, name });
    try {
      await query(
        'UPDATE subjects SET name = ? WHERE id = ?',
        [name, id]
      );
      console.log('✅ Предмет успешно обновлен');
    } catch (error) {
      console.error('❌ Ошибка при обновлении предмета:', error);
      throw error;
    }
  },

  async deleteSubject(id: string): Promise<void> {
    console.log('🗑️ Удаление предмета:', id);
    try {
      await query('DELETE FROM subjects WHERE id = ?', [id]);
      console.log('✅ Предмет успешно удален');
    } catch (error) {
      console.error('❌ Ошибка при удалении предмета:', error);
      throw error;
    }
  }
};