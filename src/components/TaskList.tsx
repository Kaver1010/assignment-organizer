import { Task } from "@/pages/Index";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface TaskListProps {
  tasks: Task[];
  selectedTask: Task | null;
  onTaskSelect: (task: Task) => void;
}

export const TaskList = ({ tasks, selectedTask, onTaskSelect }: TaskListProps) => {
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={cn(
                      "font-medium",
                      task.completed && "line-through"
                    )}>
                      {task.subject}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(task.dueDate, "d MMMM", { locale: ru })}
                    </p>
                  </div>
                  {task.completed && (
                    <span className="text-green-500 text-sm">Выполнено</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};