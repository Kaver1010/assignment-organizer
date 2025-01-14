import { useState } from "react";
import { Task } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/Calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task) => void;
}

export const TaskForm = ({ task, onSubmit }: TaskFormProps) => {
  const [subject, setSubject] = useState(task?.subject || "");
  const [content, setContent] = useState(task?.content || "");
  const [dueDate, setDueDate] = useState<Date>(task?.dueDate || new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: task?.id || Math.random().toString(),
      subject,
      content,
      dueDate,
      completed: task?.completed || false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>
          {task ? "Редактировать задание" : "Новое задание"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="subject">Предмет</Label>
          <Select
            value={subject}
            onValueChange={setSubject}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите предмет" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Математика">Математика</SelectItem>
              <SelectItem value="Русский язык">Русский язык</SelectItem>
              <SelectItem value="Физика">Физика</SelectItem>
              {/* Добавьте другие предметы */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="content">Задание</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-32"
            placeholder="Опишите задание..."
          />
        </div>

        <div>
          <Label>Дата сдачи</Label>
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={(date) => date && setDueDate(date)}
            className="rounded-md border"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {task ? "Сохранить изменения" : "Создать задание"}
      </Button>
    </form>
  );
};