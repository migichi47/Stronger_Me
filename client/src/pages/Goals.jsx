
import { useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Flag,
  ListChecks,
  Plus,
  Target,
  Trash2,
  X,
} from "lucide-react";

const categories = [
  "Personal",
  "Academics",
  "Career",
  "Health & Fitness",
  "Finance",
  "Other",
];

const views = [
  { id: "daily", label: "Daily non-negotiables", icon: ListChecks },
  { id: "longTerm", label: "Long-term goals", icon: Target },
];

const emptyForm = {
  title: "",
  category: "Personal",
  deadline: "",
  notes: "",
};

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [activeView, setActiveView] = useState("daily");
  const [openCategory, setOpenCategory] = useState("Personal");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const visibleGoals = goals.filter(
    (goal) => goal.type === activeView,
  );

  const completedCount = visibleGoals.filter(
    (goal) => goal.done,
  ).length;

  function changeView(view) {
    setActiveView(view);
    setOpenCategory("Personal");
    setShowForm(false);
    setForm(emptyForm);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    const newGoal = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category,
      deadline: form.deadline,
      notes: form.notes.trim(),
      type: activeView,
      done: false,
      createdAt: new Date().toISOString(),
    };

    setGoals((current) => [newGoal, ...current]);
    setOpenCategory(form.category);
    setForm(emptyForm);
    setShowForm(false);
  }

  function toggleGoal(id) {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === id ? { ...goal, done: !goal.done } : goal,
      ),
    );
  }

  function deleteGoal(id) {
    setGoals((current) =>
      current.filter((goal) => goal.id !== id),
    );
  }

  function formatDate(date) {
    if (!date) return "";

    return new Date(`${date}T12:00:00`).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );
  }

  return (
    <main className="w-full max-w-none space-y-6 pb-10">
      {/* Page heading */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Your life, by design
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Goals & Intentions
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-gray-400">
            Make promises to yourself. Keep them one day at a time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Close form" : "Create a goal"}
        </button>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-cards p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
            <Target size={17} className="text-emerald-500" />
            Total goals
          </div>

          <p className="text-3xl font-semibold">{goals.length}</p>
          <p className="mt-1 text-xs text-gray-500">
            Across both workspaces
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-cards p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
            <ListChecks size={17} className="text-emerald-500" />
            In this workspace
          </div>

          <p className="text-3xl font-semibold">
            {visibleGoals.length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {activeView === "daily"
              ? "Daily non-negotiables"
              : "Long-term goals"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-cards p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
            <Check size={17} className="text-emerald-500" />
            Completed
          </div>

          <p className="text-3xl font-semibold">{completedCount}</p>
          <p className="mt-1 text-xs text-gray-500">
            In the selected workspace
          </p>
        </div>
      </section>

      {/* Workspace selector */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Your workspace</h2>
            <p className="mt-1 text-sm text-gray-400">
              Choose what you're working towards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {views.map(({ id, label, icon: Icon }) => {
            const selected = activeView === id;
            const count = goals.filter(
              (goal) => goal.type === id,
            ).length;

            return (
              <button
                key={id}
                type="button"
                onClick={() => changeView(id)}
                aria-pressed={selected}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition sm:p-5 ${
                  selected
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : "border-white/5 bg-cards hover:border-gray-600"
                }`}
              >
                <span
                  className={`rounded-xl p-3 ${
                    selected
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  <Icon size={22} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">
                    {label}
                  </span>
                  <span className="mt-1 block text-xs text-gray-400">
                    {count} {count === 1 ? "goal" : "goals"}
                  </span>
                </span>

                {selected && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Goal creation form */}
      {showForm && (
        <section className="rounded-2xl border border-emerald-500/20 bg-cards p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
              New entry
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {activeView === "daily"
                ? "Set a daily non-negotiable"
                : "Define a long-term goal"}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {activeView === "daily"
                ? "Choose an action you want to commit to consistently."
                : "Describe something meaningful you want to accomplish."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="goal-title"
                className="text-sm font-medium"
              >
                Goal name *
              </label>

              <input
                id="goal-title"
                required
                maxLength={120}
                value={form.title}
                onChange={(event) =>
                  setForm({
                    ...form,
                    title: event.target.value,
                  })
                }
                placeholder={
                  activeView === "daily"
                    ? "e.g. Read for 20 minutes"
                    : "e.g. Build and launch my portfolio"
                }
                className="w-full rounded-xl border border-gray-600 bg-transparent p-3 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="goal-category"
                  className="text-sm font-medium"
                >
                  Category
                </label>

                <select
                  id="goal-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-600 bg-transparent p-3 outline-none focus:border-emerald-500"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-gray-900"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="goal-deadline"
                  className="text-sm font-medium"
                >
                  {activeView === "daily"
                    ? "Target date (optional)"
                    : "Deadline (optional)"}
                </label>

                <input
                  id="goal-deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      deadline: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-600 bg-transparent p-3 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="goal-notes"
                className="text-sm font-medium"
              >
                Notes <span className="text-gray-500">(optional)</span>
              </label>

              <textarea
                id="goal-notes"
                rows={3}
                maxLength={500}
                value={form.notes}
                onChange={(event) =>
                  setForm({
                    ...form,
                    notes: event.target.value,
                  })
                }
                placeholder="Add details, milestones, or a reminder to yourself..."
                className="w-full resize-y rounded-xl border border-gray-600 bg-transparent p-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Plus size={17} />
                Save goal
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(emptyForm);
                }}
                className="rounded-xl border border-gray-600 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Category accordion */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            {activeView === "daily"
              ? "Daily non-negotiables"
              : "Long-term goals"}
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Select a category to focus on its goals.
          </p>
        </div>

        <div className="space-y-3">
          {categories.map((category) => {
            const categoryGoals = visibleGoals.filter(
              (goal) => goal.category === category,
            );

            const expanded = openCategory === category;
            const categoryCompleted = categoryGoals.filter(
              (goal) => goal.done,
            ).length;

            return (
              <section
                key={category}
                className={`overflow-hidden rounded-2xl border transition ${
                  expanded
                    ? "border-emerald-500/30 bg-cards"
                    : "border-white/5 bg-cards/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenCategory(expanded ? null : category)
                  }
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-white/[0.02] sm:p-5"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      expanded
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {category === "Career" ? (
                      <Flag size={19} />
                    ) : category === "Other" ? (
                      <Target size={19} />
                    ) : (
                      <ListChecks size={19} />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">
                      {category}
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                      {categoryGoals.length}{" "}
                      {categoryGoals.length === 1 ? "goal" : "goals"}
                      {categoryGoals.length > 0 &&
                        ` · ${categoryCompleted} completed`}
                    </span>
                  </span>

                  <ChevronDown
                    size={19}
                    className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                      expanded ? "rotate-180 text-emerald-500" : ""
                    }`}
                  />
                </button>

                {expanded && (
                  <div className="border-t border-white/5 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
                    {categoryGoals.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-600/70 px-4 py-7 text-center">
                        <p className="text-sm font-medium">
                          Nothing here yet
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          Add a {category.toLowerCase()} goal to start
                          building this list.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            setForm({
                              ...emptyForm,
                              category,
                            });
                            setShowForm(true);
                          }}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-500 transition hover:text-emerald-400"
                        >
                          <Plus size={16} />
                          Add to {category}
                        </button>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {categoryGoals.map((goal) => (
                          <li
                            key={goal.id}
                            className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/10 p-4"
                          >
                            <button
                              type="button"
                              onClick={() => toggleGoal(goal.id)}
                              aria-label={
                                goal.done
                                  ? `Mark ${goal.title} incomplete`
                                  : `Mark ${goal.title} complete`
                              }
                              aria-pressed={goal.done}
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                                goal.done
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-gray-500 hover:border-emerald-500"
                              }`}
                            >
                              {goal.done && <Check size={14} />}
                            </button>

                            <div className="min-w-0 flex-1 space-y-2">
                              <p
                                className={`break-words text-sm font-medium ${
                                  goal.done
                                    ? "text-gray-500 line-through"
                                    : "text-gray-100"
                                }`}
                              >
                                {goal.title}
                              </p>

                              {goal.deadline && (
                                <p className="flex items-center gap-2 text-xs text-gray-400">
                                  <CalendarDays size={14} />
                                  {activeView === "daily"
                                    ? "Target"
                                    : "Deadline"}{" "}
                                  · {formatDate(goal.deadline)}
                                </p>
                              )}

                              {goal.notes && (
                                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-400">
                                  {goal.notes}
                                </p>
                              )}

                              {goal.done && (
                                <p className="text-xs font-medium text-emerald-500">
                                  Completed
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteGoal(goal.id)}
                              aria-label={`Delete ${goal.title}`}
                              className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {categoryGoals.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm({
                            ...emptyForm,
                            category,
                          });
                          setShowForm(true);
                        }}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-emerald-500 transition hover:bg-emerald-500/10"
                      >
                        <Plus size={16} />
                        Add another goal
                      </button>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Goals;
