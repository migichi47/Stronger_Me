import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const DashboardCalendar = ({ dailyRecords = {} }) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monday-first offset: Monday = 0, Sunday = 6
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;

  const todayKey = getDateKey(new Date());

  const monthName = currentMonth.toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-gray-900 p-5 text-white">
      {/* Month navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={previousMonth}
          aria-label="Previous month"
          className="rounded-lg p-2 hover:bg-gray-800"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-lg font-semibold">{monthName}</h2>

        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="rounded-lg p-2 hover:bg-gray-800"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headings */}
      <div className="mb-3 grid grid-cols-7 text-center">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="py-2 text-xs font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* DashboardCalendar dates */}
      <div className="grid grid-cols-7 gap-y-2">
        {/* Empty spaces before the first day */}
        {Array.from({ length: firstDayOffset }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;

          const date = new Date(year, month, day);
          const dateKey = getDateKey(date);

          const isComplete = dailyRecords[dateKey]?.completedAll === true;

          const isToday = dateKey === todayKey;

          return (
            <div key={dateKey} className="flex justify-center">
              <div
                title={
                  isComplete
                    ? "All non-negotiable tasks completed"
                    : "Not all tasks completed"
                }
                className={`
                  flex h-9 w-9 items-center justify-center
                  rounded-full text-sm transition-colors
                  ${
                    isComplete
                      ? "bg-green-500 font-semibold text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }
                  ${
                    isToday && !isComplete
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900"
                      : ""
                  }
                `}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-5 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          Completed
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full ring-2 ring-blue-500" />
          Today
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendar;
