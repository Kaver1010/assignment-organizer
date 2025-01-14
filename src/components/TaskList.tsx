import { Task } from "@/pages/Index";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Check, FileIcon } from "lucide-react";
import { Button } from "./ui/button";

interface TaskListProps {
  tasks: Task[];
  selectedTask: Task | null;
  onTaskSelect: (task: Task) => void;
  onUpdate: (task: Task) => void;
}

export const TaskList = ({ tasks, selectedTask, onTaskSelect, onUpdate }: TaskListProps) => {
  const handleToggleComplete = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    onUpdate({ ...task, completed: !task.completed });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Список заданий</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Нет заданий</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onTaskSelect(task)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  selectedTask?.id === task.id && "bg-gray-50",
                  task.completed && "opacity-60"
                )}
              >
                <div className="flex items-start gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "mt-1 h-5 w-5 rounded-full",
                      task.completed && "bg-green-500 text-white hover:bg-green-600"
                    )}
                    onClick={(e) => handleToggleComplete(e, task)}
                  >
                    {task.completed && <Check className="h-3 w-3" />}
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={cn(
                        "font-medium truncate",
                        task.completed && "line-through"
                      )}>
                        {task.subject}
                      </h3>
                      {task.files?.length > 0 && (
                        <FileIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {task.content}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(task.dueDate, "d MMMM", { locale: ru })}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};