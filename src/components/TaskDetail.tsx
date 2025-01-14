import { Task } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";
import { format, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";
import { X, Edit, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskDetail = ({ task, onClose, onUpdate, onDelete }: TaskDetailProps) => {
  const isMobile = useIsMobile();

  if (!task) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Выберите задание для просмотра деталей
      </div>
    );
  }

  const daysLeft = differenceInDays(task.dueDate, new Date());

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
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{task.subject}</h2>
            <p className="text-sm text-gray-500">
              Сдать до: {format(task.dueDate, "d MMMM yyyy", { locale: ru })}
            </p>
            {daysLeft >= 0 && (
              <p className="text-sm text-blue-600 mt-1">
                Осталось дней: {daysLeft}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Задание:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{task.content}</p>
          </div>

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
              </DialogTrigger>
              <DialogContent>
                <TaskForm
                  task={task}
                  onSubmit={onUpdate}
                />
              </DialogContent>
            </Dialog>

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