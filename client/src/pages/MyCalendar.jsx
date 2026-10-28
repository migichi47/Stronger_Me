import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Clock3,
  Check,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import categories from "../data/categories";
import categoryStyles from "../data/categoryStyles";
import { dateKey, formatDate } from "../services/dateServices";
import STORAGE_KEY from "../data/STORAGE_KEY";
import { getStoredTasks } from "../services/tasksServices";

const emptyForm = {
  title: "",
  date: "",
  startTime: "09:00",
  endTime: "10:00",
  category: "Personal",
  notes: "",
};

function createId() {
  return crypto.randomUUID();
}

function shiftDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getWeekStart(date) {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - ((day + 6) % 7));
  result.setHours(0, 0, 0, 0);
  return result;
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    return (
      a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
    );
  });
}

function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDuration(start, end) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);

  if (minutes <= 0) return "Invalid duration";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours && remainingMinutes) {
    return `${hours}h ${remainingMinutes}m`;
  }

  if (hours) return `${hours}h`;

  return `${remainingMinutes}m`;
}

export default function MyCalendar() {
  const [tasks, setTasks] = useState(getStoredTasks);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [view, setView] = useState("week");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // Persist tasks whenever they change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const today = new Date();
  const todayKey = dateKey(today);
  const selectedKey = dateKey(selectedDate);
  const selectedTasks = sortTasks(
    tasks.filter((task) => task.date === selectedKey),
  );
  const completedTasks = selectedTasks.filter((task) => task.completed).length;
  const completion =
    selectedTasks.length > 0
      ? Math.round((completedTasks / selectedTasks.length) * 100)
      : 10;
  const weekStart = getWeekStart(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    shiftDate(weekStart, index),
  );
  const monthStart = getMonthStart(selectedDate);
  const daysInMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
  ).getDate();
  const monthOffset = (monthStart.getDay() + 6) % 7;
  const monthDays = [
    ...Array(monthOffset).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) =>
        new Date(monthStart.getFullYear(), monthStart.getMonth(), index + 1),
    ),
  ];

  function navigate(direction) {
    if (view === "week") {
      setSelectedDate(shiftDate(selectedDate, direction * 7));
    } else if (view === "month") {
      setSelectedDate(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + direction,
          1,
        ),
      );
    } else {
      setSelectedDate(shiftDate(selectedDate, direction));
    }
  }

  function goToToday() {
    setSelectedDate(new Date());
  }

  function openCreateModal(date = selectedDate) {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: dateKey(date),
    });
    setError("");
    setShowModal(true);
  }

  function openEditModal(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      date: task.date,
      startTime: task.startTime,
      endTime: task.endTime,
      category: task.category,
      notes: task.notes || "",
    });
    setError("");
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setError("");
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function saveTask(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }
    if (!form.date) {
      setError("Please choose a date.");
      return;
    }
    if (form.endTime <= form.startTime) {
      setError("End time must be later than start time.");
      return;
    }
    if (editingId) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? {
                ...task,
                ...form,
                title: form.title.trim(),
              }
            : task,
        ),
      );
    } else {
      setTasks((previous) => [
        ...previous,
        {
          id: createId(),
          ...form,
          title: form.title.trim(),
          completed: false,
        },
      ]);
    }
    setSelectedDate(new Date(`${form.date}T12:00:00`));
    closeModal();
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    setTasks((previous) => previous.filter((task) => task.id !== id));
  }

  function getTasksForDate(date) {
    return sortTasks(tasks.filter((task) => task.date === dateKey(date)));
  }

  const heading =
    view === "month"
      ? formatDate(selectedDate, {
          month: "long",
          year: "numeric",
        })
      : view === "week"
        ? `${formatDate(weekDays[0], {
            month: "short",
            day: "numeric",
          })} – ${formatDate(weekDays[6], {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`
        : formatDate(selectedDate, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          });

  const upcomingTasks = sortTasks(
    tasks.filter((task) => task.date >= todayKey),
  );

  return (
    <div className="min-h-screen bg-background p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-7 w-7 text-blue-600" />
              <h1 className="text-2xl font-bold sm:text-3xl">My Calendar</h1>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Plan your time. Make every day count.
            </p>
          </div>

          <button
            onClick={() => openCreateModal()}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={19} />
            Add task
          </button>
        </header>
        <section className="overflow-hidden rounded-2xl border border-gray-700 bg-cards shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-700 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Previous period"
                  className="rounded-lg border border-gray-600 p-2 transition hover:bg-gray-700"
                >
                  <ChevronLeft size={19} />
                </button>
                <button
                  onClick={() => navigate(1)}
                  aria-label="Next period"
                  className="rounded-lg border border-gray-600 p-2 transition hover:bg-gray-700"
                >
                  <ChevronRight size={19} />
                </button>
                <h2 className="text-base font-bold sm:text-lg">{heading}</h2>
              </div>
              <button
                onClick={goToToday}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold transition hover:bg-gray-700"
              >
                Today
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex rounded-xl bg-background p-1">
                {["week", "month", "agenda"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setView(item)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition sm:px-4 cursor-pointer ${
                      view === item
                        ? "bg-cards text-success shadow-sm"
                        : "text-white hover:text-gray-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                {selectedTasks.length} task
                {selectedTasks.length !== 1 ? "s" : ""} on selected day
              </p>
            </div>
          </div>

          {view === "week" && (
            <div>
              <div className="grid grid-cols-7 border-b border-gray-700">
                {weekDays.map((day) => {
                  const key = dateKey(day);
                  const active = key === selectedKey;
                  const isToday = key === todayKey;
                  const dayTasks = getTasksForDate(day);

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDate(day)}
                      className={`flex min-w-0 flex-col items-center gap-2 border-r border-gray-700 px-1 py-4 transition last:border-r-0 sm:py-5 ${
                        active ? "bg-success" : "hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm ${
                          active ? "font-semibold" : "text-white"
                        }`}
                      >
                        {formatDate(day, { weekday: "short" })}
                      </span>

                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold sm:h-10 sm:w-10 ${
                          active
                            ? "bg-blue-600 text-white"
                            : isToday
                              ? "border-2 border-success text-success"
                              : "text-white"
                        }`}
                      >
                        {day.getDate()}
                      </span>

                      <div className="flex h-1.5 items-center gap-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <span
                            key={task.id}
                            className={`h-1.5 w-1.5 rounded-full ${
                              task.completed
                                ? "bg-green-500"
                                : categoryStyles[task.category]?.dot ||
                                  "bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_280px]">
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold">
                        {formatDate(selectedDate, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Your schedule for the day
                      </p>
                    </div>

                    <button
                      onClick={() => openCreateModal(selectedDate)}
                      className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      <Plus size={17} />
                      Add
                    </button>
                  </div>

                  {selectedTasks.length === 0 ? (
                    <EmptyState onAdd={() => openCreateModal(selectedDate)} />
                  ) : (
                    <div className="space-y-3">
                      {selectedTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onEdit={openEditModal}
                          onDelete={deleteTask}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <aside className="h-fit rounded-xl border border-gray-700 p-4">
                  <h3 className="font-bold">Daily progress</h3>

                  <div className="mt-4 flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#2563eb ${
                          completion * 3.6
                        }deg, #e5e7eb 0deg)`,
                      }}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-sm font-bold">
                        {completion}%
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold">
                        {completedTasks} of {selectedTasks.length}
                      </p>
                      <p className="text-xs text-gray-500">Tasks completed</p>
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>

                  <div className="mt-5 space-y-3 border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold">Categories</h4>

                    {categories.map((category) => {
                      const count = selectedTasks.filter(
                        (task) => task.category === category.name,
                      ).length;

                      return (
                        <div
                          key={category.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center gap-2 text-gray-600">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${category.color}`}
                            />
                            {category.name}
                          </span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </div>
          )}

          {/* Month view */}
          {view === "month" && (
            <div className="p-3 sm:p-5">
              <div className="grid grid-cols-7 border-b border-gray-700 pb-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-semibold text-white sm:text-sm"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7">
                {monthDays.map((day, index) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="min-h-20 border-b border-r border-gray-700 sm:min-h-28"
                      />
                    );
                  }

                  const key = dateKey(day);
                  const active = key === selectedKey;
                  const isToday = key === todayKey;
                  const dayTasks = getTasksForDate(day);

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDate(day)}
                      className={`min-w-0 border-b border-r border-gray-700 p-1 text-left transition sm:min-h-28 sm:p-2 ${
                        active ? "bg-blue-50" : "hover:bg-gray-800"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm ${
                          active
                            ? "bg-blue-600 text-white"
                            : isToday
                              ? "border border-blue-600 text-blue-600"
                              : "text-white"
                        }`}
                      >
                        {day.getDate()}
                      </span>

                      <div className="mt-1 space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className={`truncate rounded px-1 py-1 text-[9px] sm:text-xs ${
                              task.completed
                                ? "bg-gray-100 text-gray-500 line-through"
                                : categoryStyles[task.category]?.card ||
                                  "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span className="hidden sm:inline">
                              {task.startTime}{" "}
                            </span>
                            {task.title}
                          </div>
                        ))}

                        {dayTasks.length > 2 && (
                          <p className="px-1 text-[9px] text-gray-500 sm:text-xs">
                            +{dayTasks.length - 2} more
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <h3 className="mb-4 font-bold">
                  {formatDate(selectedDate, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                {selectedTasks.length === 0 ? (
                  <EmptyState onAdd={() => openCreateModal(selectedDate)} />
                ) : (
                  <div className="space-y-3">
                    {selectedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onEdit={openEditModal}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Agenda view */}
          {view === "agenda" && (
            <div className="p-4 sm:p-6">
              <h3 className="mb-4 font-bold">Upcoming schedule</h3>

              {upcomingTasks.length === 0 ? (
                <EmptyState onAdd={() => openCreateModal()} />
              ) : (
                <div className="space-y-6">
                  {Object.entries(
                    upcomingTasks.reduce((groups, task) => {
                      if (!groups[task.date]) groups[task.date] = [];
                      groups[task.date].push(task);
                      return groups;
                    }, {}),
                  ).map(([date, dateTasks]) => (
                    <div key={date}>
                      <button
                        onClick={() =>
                          setSelectedDate(new Date(`${date}T12:00:00`))
                        }
                        className="mb-3 text-sm font-bold text-gray-700 hover:text-blue-600"
                      >
                        {formatDate(new Date(`${date}T12:00:00`), {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </button>

                      <div className="space-y-3">
                        {dateTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onEdit={openEditModal}
                            onDelete={deleteTask}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Create / edit modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-700 p-5">
              <div>
                <h2 id="task-modal-title" className="text-xl font-bold">
                  {editingId ? "Edit task" : "Create a task"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add details to your schedule.
                </p>
              </div>

              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveTask} className="space-y-5 p-5">
              <div>
                <label
                  htmlFor="task-title"
                  className="mb-2 block text-sm font-semibold"
                >
                  Task title
                </label>

                <input
                  id="task-title"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Study React hooks"
                  autoFocus
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="task-date"
                  className="mb-2 block text-sm font-semibold"
                >
                  Date
                </label>

                <input
                  id="task-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="task-start"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Start time
                  </label>

                  <input
                    id="task-start"
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleFormChange}
                    required
                    className="w-full min-w-0 rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-end"
                    className="mb-2 block text-sm font-semibold"
                  >
                    End time
                  </label>

                  <input
                    id="task-end"
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleFormChange}
                    required
                    className="w-full min-w-0 rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="task-category"
                  className="mb-2 block text-sm font-semibold"
                >
                  Category
                </label>

                <select
                  id="task-category"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="task-notes"
                  className="mb-2 block text-sm font-semibold"
                >
                  Notes{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>

                <textarea
                  id="task-notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Additional details..."
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  {editingId ? "Save changes" : "Create task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-500 px-4 py-12 text-center">
      <div className="rounded-2xl bg-gray-100 p-4">
        <CalendarDays className="h-7 w-7 text-gray-400" />
      </div>

      <h3 className="mt-4 font-semibold">Nothing scheduled yet</h3>

      <p className="mt-1 max-w-xs text-sm text-gray-500">
        Add a task to plan your day and keep yourself on track.
      </p>

      <button
        onClick={onAdd}
        className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Plus size={17} />
        Add your first task
      </button>
    </div>
  );
}

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const style = categoryStyles[task.category] || categoryStyles.Other;

  return (
    <article
      className={`group flex flex-col gap-3 rounded-xl border p-4 transition sm:flex-row sm:items-center ${
        task.completed
          ? "border-gray-700 bg-gray-50"
          : "border-gray-700 bg-white hover:border-blue-200 hover:shadow-sm"
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark task incomplete" : "Complete task"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center self-start rounded-full border-2 transition sm:self-center ${
          task.completed
            ? "border-green-500 bg-green-500 text-white"
            : "border-gray-300 hover:border-blue-500"
        }`}
      >
        {task.completed && <Check size={14} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4
            className={`break-words font-semibold ${
              task.completed ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {task.title}
          </h4>

          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              task.completed ? "bg-gray-200 text-gray-500" : style.card
            }`}
          >
            {task.category}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock3 size={13} />
            {formatTime(task.startTime)} – {formatTime(task.endTime)}
          </span>

          <span>{getDuration(task.startTime, task.endTime)}</span>
        </div>

        {task.notes && (
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-500">
            {task.notes}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 self-end sm:self-center">
        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
        >
          <Pencil size={17} />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}
