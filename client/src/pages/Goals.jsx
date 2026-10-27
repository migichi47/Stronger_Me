
import { useState } from "react";
import { Plus, Target, Trash2 } from "lucide-react";

const categories = [
  "Personal",
  "Academics",
  "Career",
  "Health & Fitness",
  "Finance",
  "Other",
];

const Goals = () => {
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("Personal");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [goals, setGoals] = useState([]);

  const completedCount = goals.filter((item) => item.done).length;

  function handleSubmit(event) {
    event.preventDefault();

    if (!goal.trim()) return;

    const newGoal = {
      id: crypto.randomUUID(),
      title: goal.trim(),
      category,
      deadline,
      notes: notes.trim(),
      done: false,
    };

    setGoals((current) => [newGoal, ...current]);

    setGoal("");
    setCategory("Personal");
    setDeadline("");
    setNotes("");
  }

  function toggleGoal(id) {
    setGoals((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  }

  function deleteGoal(id) {
    setGoals((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 pb-10">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-500">
          Make it happen
        </p>

        <h1 className="text-3xl font-bold">My Goals</h1>

        <p className="max-w-xl text-gray-400">
          Set intentions, track your achievements, and keep
          showing up for the person you're becoming.
        </p>
      </header>

      <section className="rounded-2xl bg-cards p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
            <Target size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">Add a new goal</h2>
            <p className="text-sm text-gray-400">
              What would you like to accomplish?
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="goal-title" className="text-sm font-medium">
              Goal name *
            </label>

            <input
              id="goal-title"
              required
              maxLength={120}
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="e.g. Finish my portfolio website"
              className="w-full rounded-xl border border-gray-600 bg-transparent p-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="goal-category" className="text-sm font-medium">
                Category
              </label>

              <select
                id="goal-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-gray-600 bg-transparent p-3 outline-none focus:border-emerald-500"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-gray-900"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="goal-deadline" className="text-sm font-medium">
                Target date (optional)
              </label>

              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                className="w-full rounded-xl border border-gray-600 bg-transparent p-3 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="goal-notes" className="text-sm font-medium">
              Notes <span className="text-gray-400">(optional)</span>
            </label>

            <textarea
              id="goal-notes"
              rows={3}
              maxLength={500}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Describe what success looks like..."
              className="w-full resize-y rounded-xl border border-gray-600 bg-transparent p-3 outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Create goal
          </button>
        </form>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Your goal log</h2>
            <p className="mt-1 text-sm text-gray-400">
              Every achievement starts with an intention.
            </p>
          </div>

          <p className="text-sm text-gray-400">
            <span className="font-semibold text-emerald-500">
              {completedCount}
            </span>{" "}
            of {goals.length} completed
          </p>
        </div>

        {goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-600 px-5 py-12 text-center">
            <Target className="mx-auto mb-3 text-emerald-500" size={36} />

            <h3 className="font-semibold">Your goals start here</h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">
              Add your first goal above. It will appear here,
              ready for you to track.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {goals.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-2xl bg-cards p-4 sm:p-5"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleGoal(item.id)}
                  aria-label={`Mark ${item.title} ${
                    item.done ? "incomplete" : "complete"
                  }`}
                  className="mt-1 h-5 w-5 shrink-0 accent-emerald-500"
                />

                <div className="min-w-0 flex-1 space-y-2">
                  <h3
                    className={`wrap-break-word font-medium ${
                      item.done ? "text-gray-400 line-through" : ""
                    }`}
                  >
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-500">
                      {item.category}
                    </span>

                    {item.deadline && (
                      <span className="rounded-full bg-gray-700 px-3 py-1 text-gray-300">
                        Due{" "}
                        {new Date(
                          `${item.deadline}T12:00:00`,
                        ).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}

                    {item.done && (
                      <span className="text-emerald-500">
                        Completed ✓
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="whitespace-pre-wrap wrap-break-word text-sm text-gray-400">
                      {item.notes}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => deleteGoal(item.id)}
                  aria-label={`Delete ${item.title}`}
                  className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Goals;
