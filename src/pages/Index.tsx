import { useState, useEffect } from "react";
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
import { tasksService } from "@/services/tasks";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Загрузка заданий при монтировании компонента
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      console.log('🔄 Загрузка заданий...');
      const loadedTasks = await tasksService.getAllTasks();
      console.log('✅ Задания загружены:', loadedTasks);
      setTasks(loadedTasks);
    } catch (error) {
      console.error('❌ Ошибка при загрузке заданий:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить задания",
        variant: "destructive",
      });
    }
  };

  const handleCreateTask = async (task: Task) => {
    try {
      console.log('➕ Создание нового задания:', task);
      const taskId = await tasksService.createTask({
        ...task,
        subjectId: task.subject, // Временное решение, позже нужно будет связать с реальными ID предметов
        files: [],
      });
      console.log('✅ Задание создано с ID:', taskId);
      await loadTasks(); // Перезагружаем список заданий
      toast({
        title: "Успех",
        description: "Задание успешно создано",
      });
    } catch (error) {
      console.error('❌ Ошибка при создании задания:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать задание",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      console.log('📝 Обновление задания:', updatedTask);
      await tasksService.updateTask(updatedTask.id, {
        ...updatedTask,
        subjectId: updatedTask.subject, // Временное решение
      });
      console.log('✅ Задание обновлено');
      await loadTasks(); // Перезагружаем список заданий
      toast({
        title: "Успех",
        description: "Задание успешно обновлено",
      });
    } catch (error) {
      console.error('❌ Ошибка при обновлении задания:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить задание",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log('🗑️ Удаление задания:', taskId);
      await tasksService.deleteTask(taskId);
      console.log('✅ Задание удалено');
      setSelectedTask(null);
      await loadTasks(); // Перезагружаем список заданий
      toast({
        title: "Успех",
        description: "Задание успешно удалено",
      });
    } catch (error) {
      console.error('❌ Ошибка при удалении задания:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить задание",
        variant: "destructive",
      });
    }
  };

  const filteredTasks = selectedDate
    ? tasks.filter(
        (task) =>
          task.dueDate.toDateString() === selectedDate.toDateString()
      )
    : tasks;

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.completed ? 1 : -1;
  });

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
                <TaskForm onSubmit={handleCreateTask} />
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
                onDelete={handleDeleteTask}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;