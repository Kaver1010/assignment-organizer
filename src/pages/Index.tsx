import { useState } from "react";
import { TaskList } from "@/components/TaskList";
import { TaskDetail } from "@/components/TaskDetail";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";
import { DateFilter } from "@/components/DateFilter";
import { SubjectManager } from "@/components/SubjectManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { Task } from "@/types/task";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();

  const filteredTasks = selectedDate
    ? tasks.filter(
        (task) =>
          task.dueDate.toDateString() === selectedDate.toDateString()
      )
    : tasks;

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    return a.completed ? 1 : -1;
  });

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => 
      t.id === updatedTask.id ? updatedTask : t
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Домашние задания</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Управление предметами</Button>
              </DialogTrigger>
              <DialogContent>
                <SubjectManager />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить задание
                </Button>
              </DialogTrigger>
              <DialogContent>
                <TaskForm onSubmit={(task) => setTasks([...tasks, task])} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <DateFilter
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onClear={() => setSelectedDate(null)}
        />

        <div className={`flex ${isMobile ? 'flex-col' : 'gap-6'} mt-6`}>
          <div className={`${isMobile ? 'w-full' : 'w-1/3'}`}>
            <TaskList
              tasks={sortedTasks}
              onTaskSelect={setSelectedTask}
              selectedTask={selectedTask}
              onUpdate={handleUpdateTask}
            />
          </div>
          {(!isMobile || selectedTask) && (
            <div className={`${isMobile ? 'w-full mt-4' : 'w-2/3'}`}>
              <TaskDetail
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                onUpdate={handleUpdateTask}
                onDelete={(taskId) => {
                  setTasks(tasks.filter(t => t.id !== taskId));
                  setSelectedTask(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;