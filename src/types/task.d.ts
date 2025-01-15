export interface TaskFile {
  id: string;
  taskId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  subject: string;
  subjectId?: string;
  content: string;
  dueDate: Date;
  completed: boolean;
  files?: TaskFile[];
  createdAt?: Date;
}

export interface TaskWithFiles extends Omit<Task, 'subject'> {
  subjectId: string;
  subject_name: string;
}