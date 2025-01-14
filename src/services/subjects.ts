import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface Subject {
  id: string;
  name: string;
}

export const subjectsService = {
  async getAllSubjects(): Promise<Subject[]> {
    return query<Subject[]>('SELECT * FROM subjects ORDER BY name');
  },

  async createSubject(name: string): Promise<string> {
    const id = uuidv4();
    await query(
      'INSERT INTO subjects (id, name) VALUES (?, ?)',
      [id, name]
    );
    return id;
  },

  async updateSubject(id: string, name: string): Promise<void> {
    await query(
      'UPDATE subjects SET name = ? WHERE id = ?',
      [name, id]
    );
  },

  async deleteSubject(id: string): Promise<void> {
    await query('DELETE FROM subjects WHERE id = ?', [id]);
  }
};