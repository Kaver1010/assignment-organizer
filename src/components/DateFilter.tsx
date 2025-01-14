import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";

interface DateFilterProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  onClear: () => void;
}

export const DateFilter = ({
  selectedDate,
  onDateSelect,
  onClear,
}: DateFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={selectedDate ? "text-blue-600" : ""}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate
              ? format(selectedDate, "d MMMM yyyy", { locale: ru })
              : "Фильтр по дате"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={onDateSelect}
          />
        </PopoverContent>
      </Popover>

      {selectedDate && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="text-gray-500"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};