import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";
import { format, differenceInCalendarDays } from "date-fns";
import { ru } from "date-fns/locale";
import { X, Pencil, Trash, FileIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar } from "@/components/Calendar";
import { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskDetail = ({ task, onClose, onUpdate, onDelete }: TaskDetailProps) => {
  const isMobile = useIsMobile();
  const [editingField, setEditingField] = useState<"subject" | "content" | "dueDate" | null>(null);

  if (!task) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Выберите задание для просмотра деталей
      </div>
    );
  }

  const daysLeft = differenceInCalendarDays(task.dueDate, new Date());

  const handleFieldUpdate = (field: string, value: any) => {
    onUpdate({ ...task, [field]: value });
    setEditingField(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {editingField === "subject" ? (
                <Select
                  value={task.subject}
                  onValueChange={(value) => handleFieldUpdate("subject", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите предмет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Математика">Математика</SelectItem>
                    <SelectItem value="Русский язык">Русский язык</SelectItem>
                    <SelectItem value="Физика">Физика</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">{task.subject}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingField("subject")}
                    className="h-6 w-6"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingField === "dueDate" ? (
                <div className="w-full">
                  <Calendar
                    mode="single"
                    selected={task.dueDate}
                    onSelect={(date) => date && handleFieldUpdate("dueDate", date)}
                    className="rounded-md border"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    Сдать до: {format(task.dueDate, "d MMMM yyyy", { locale: ru })}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingField("dueDate")}
                    className="h-6 w-6"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {daysLeft >= 0 && (
              <p className="text-sm text-blue-600">
                {daysLeft === 0 ? "Сдать сегодня" : `Осталось дней: ${daysLeft}`}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-900">Задание:</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingField("content")}
                className="h-6 w-6"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            {editingField === "content" ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const textarea = document.getElementById("content") as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const newText = text.substring(0, start) + "№" + text.substring(end);
                        textarea.value = newText;
                        textarea.selectionStart = textarea.selectionEnd = start + 1;
                        handleFieldUpdate("content", newText);
                      }
                    }}
                  >
                    №
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const textarea = document.getElementById("content") as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const newText = text.substring(0, start) + "§" + text.substring(end);
                        textarea.value = newText;
                        textarea.selectionStart = textarea.selectionEnd = start + 1;
                        handleFieldUpdate("content", newText);
                      }
                    }}
                  >
                    §
                  </Button>
                </div>
                <textarea
                  id="content"
                  value={task.content}
                  onChange={(e) => handleFieldUpdate("content", e.target.value)}
                  className="w-full h-32 p-2 border rounded-md"
                />
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{task.content}</p>
            )}
          </div>

          {task.files && task.files.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Прикрепленные файлы:</h3>
              <div className="grid grid-cols-2 gap-4">
                {task.files.map((file) => (
                  <div key={file.id} className="relative group">
                    {file.fileType.startsWith('image/') ? (
                      <img
                        src={file.filePath}
                        alt={file.fileName}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-lg">
                        <FileIcon className="h-5 w-5" />
                        <span className="text-sm truncate">{file.fileName}</span>
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        // Здесь будет логика удаления файла
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onUpdate({ ...task, completed: !task.completed })}
            >
              {task.completed ? "Отметить как невыполненное" : "Отметить как выполненное"}
            </Button>

            <Button
              variant="destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};