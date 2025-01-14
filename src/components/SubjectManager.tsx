import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";

interface Subject {
  id: string;
  name: string;
}

export const SubjectManager = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Математика" },
    { id: "2", name: "Русский язык" },
    { id: "3", name: "Физика" },
  ]);
  const [newSubject, setNewSubject] = useState("");
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, { id: Math.random().toString(), name: newSubject }]);
      setNewSubject("");
    }
  };

  const handleUpdateSubject = () => {
    if (editingSubject && editingSubject.name.trim()) {
      setSubjects(subjects.map(s => 
        s.id === editingSubject.id ? editingSubject : s
      ));
      setEditingSubject(null);
    }
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Управление предметами</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Новый предмет"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
          <Button onClick={handleAddSubject}>Добавить</Button>
        </div>

        <div className="space-y-2">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              {editingSubject?.id === subject.id ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    value={editingSubject.name}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, name: e.target.value })
                    }
                  />
                  <Button onClick={handleUpdateSubject}>Сохранить</Button>
                  <Button
                    variant="ghost"
                    onClick={() => setEditingSubject(null)}
                  >
                    Отмена
                  </Button>
                </div>
              ) : (
                <>
                  <span>{subject.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingSubject(subject)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};