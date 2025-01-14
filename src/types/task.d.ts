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
  content: string;
  dueDate: Date;
  completed: boolean;
  files?: TaskFile[];
}