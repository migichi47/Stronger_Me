
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BookOpen, CalendarDays, Check, ChevronDown, Clock3, FileText, Flame, Heart, Lightbulb, PenLine, Plus, Search,Sparkles, Tag, Trash2,
  X,
} from "lucide-react";

const ENTRIES_KEY = "stronger-me-journal-entries";
const DRAFT_KEY = "stronger-me-journal-draft";

const moods = [
  { label: "Happy" },
  { label: "Grateful" },
  { label: "Calm" },
  { label: "Focused" },
  { label: "Anxious"},
  { label: "Sad" },
  { label: "Overwhelmed"},
  { label: "Hopeful"},
];

const tagOptions = [
  "Personal growth",
  "Academics",
  "Relationships",
  "Self-care",
  "Goals",
  "Gratitude",
];

const prompts = [
  {
    title: "Who are you becoming?",
    text: "What is one small thing you can do today that your future self will thank you for?",
  },
  {
    title: "Give yourself some credit.",
    text: "What is something you handled recently that the old version of you might have struggled with?",
  },
  {
    title: "Check in with yourself.",
    text: "What has been taking up space in your mind lately, and what do you need right now?",
  },
  {
    title: "Find the lesson.",
    text: "What did today teach you about yourself, even if the day did not go as planned?",
  },
];

const emptyDraft = {
  title: "",
  content: "",
  mood: "",
  tags: [],
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function formatDate(value) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";

  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("en-KE", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function countWords(value = "") {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function getPreview(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

export default function Journal() {
  const [entries, setEntries] = useState(() =>
    readStorage(ENTRIES_KEY, [])
  );

  const [draft, setDraft] = useState(() =>
    readStorage(DRAFT_KEY, emptyDraft)
  );

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activePrompt, setActivePrompt] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All entries");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("All moods");
  const [saveStatus, setSaveStatus] = useState("saved");
  const [showPrompts, setShowPrompts] = useState(true);

  // Keep saved entries in this browser.
  useEffect(() => {
    try {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch {
      // The UI still works if browser storage is unavailable.
    }
  }, [entries]);

  // Automatically save the in-progress draft while the editor is open.
  useEffect(() => {
    if (!isEditorOpen || editingId) return;

    setSaveStatus("saving");

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unavailable");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [draft, isEditorOpen, editingId]);

  const filteredEntries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return [...entries]
      .filter((entry) => {
        const matchesQuery =
          !query ||
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query));

        const matchesMood =
          selectedMood === "All moods" || entry.mood === selectedMood;

        return matchesQuery && matchesMood;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      );
  }, [entries, searchQuery, selectedMood]);

  const totalWords = entries.reduce(
    (total, entry) => total + countWords(entry.content),
    0
  );

  const startNewEntry = () => {
    setEditingId(null);
    setDraft({ ...emptyDraft });
    setSaveStatus("saving");
    setIsEditorOpen(true);
  };

  const continueDraft = () => {
    setEditingId(null);
    setIsEditorOpen(true);
  };

  const openEntry = (entry) => {
    setEditingId(entry.id);
    setDraft({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || "",
      tags: entry.tags || [],
    });
    setSaveStatus("saved");
    setIsEditorOpen(true);
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const toggleTag = (tag) => {
    setDraft((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
  };

  const insertPrompt = () => {
    const prompt = prompts[activePrompt];

    setDraft((current) => ({
      ...current,
      content: current.content
        ? `${current.content}\n\n${prompt.title}\n${prompt.text}\n\n`
        : `${prompt.title}\n${prompt.text}\n\n`,
    }));
  };

  const saveEntry = () => {
    const title = draft.title.trim();
    const content = draft.content.trim();

    if (!title && !content) return;

    const now = new Date().toISOString();

    if (editingId) {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                title: title || "Untitled entry",
                content,
                mood: draft.mood,
                tags: draft.tags,
                updatedAt: now,
              }
            : entry
        )
      );
    } else {
      setEntries((current) => [
        {
          id: makeId(),
          title: title || "Untitled entry",
          content,
          mood: draft.mood,
          tags: draft.tags,
          createdAt: now,
          updatedAt: now,
        },
        ...current,
      ]);
    }

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore storage errors.
    }

    setDraft({ ...emptyDraft });
    setEditingId(null);
    setIsEditorOpen(false);
    setSaveStatus("saved");
    setActiveFilter("All entries");
    setSearchQuery("");
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    // A new, unsaved entry remains in browser storage as a draft.
  };

  const deleteEntry = (id) => {
    const confirmed = window.confirm("Delete this journal entry?");
    if (!confirmed) return;

    setEntries((current) => current.filter((entry) => entry.id !== id));

    if (editingId === id) {
      setIsEditorOpen(false);
      setEditingId(null);
      setDraft({ ...emptyDraft });
    }
  };

  const hasDraft = Boolean(
    draft.title?.trim() || draft.content?.trim()
  );

  const writingStreak = useMemo(() => {
    if (!entries.length) return 0;

    const days = new Set(
      entries.map((entry) =>
        new Date(entry.createdAt).toLocaleDateString("en-CA")
      )
    );

    let streak = 0;
    const day = new Date();

    while (true) {
      const key = day.toLocaleDateString("en-CA");
      if (!days.has(key)) break;
      streak += 1;
      day.setDate(day.getDate() - 1);
    }

    return streak;
  }, [entries]);

  // Editor view
  if (isEditorOpen) {
    return (
      <main className="w-full max-w-5xl mx-auto space-y-6 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={closeEditor}
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to journal
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            {saveStatus === "saving" ? (
              <>
                <Clock3 size={14} className="animate-pulse" />
                Saving draft...
              </>
            ) : saveStatus === "unavailable" ? (
              <>
                <X size={14} />
                Local save unavailable
              </>
            ) : (
              <>
                <Check size={14} className="text-emerald-400" />
                {editingId ? "Editing entry" : "Draft saved locally"}
              </>
            )}
          </div>
        </div>

        <section className="rounded-2xl border border-white/5 bg-cards p-5 sm:p-8">
          <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              YOUR JOURNAL
            </p>

            <input
              value={draft.title}
              onChange={(event) => updateDraft("title", event.target.value)}
              placeholder="Give this entry a title..."
              maxLength={120}
              className="w-full border-0 bg-transparent text-2xl font-semibold tracking-tight text-white outline-none placeholder:text-gray-600 sm:text-3xl"
            />

            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <CalendarDays size={14} />
              {formatDate(new Date().toISOString())}
              <span>·</span>
              {countWords(draft.content)} words
              <span>·</span>
              About {Math.max(1, Math.ceil(countWords(draft.content) / 200))} min read
            </div>
          </div>

          <div className="mb-7 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-300">
              <Heart size={16} />
              How are you feeling?
            </div>

            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  type="button"
                  key={mood.label}
                  onClick={() =>
                    updateDraft(
                      "mood",
                      draft.mood === mood.label ? "" : mood.label
                    )
                  }
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    draft.mood === mood.label
                      ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                      : "border-white/10 bg-black/10 text-gray-400 hover:border-emerald-500/40 hover:text-white"
                  }`}
                >
                  {mood.emoji} {mood.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-medium text-gray-200">
                Your thoughts
              </label>

              <button
                type="button"
                onClick={() => setShowPrompts((current) => !current)}
                className="inline-flex items-center gap-2 text-xs text-emerald-400 transition hover:text-emerald-300"
              >
                <Sparkles size={14} />
                {showPrompts ? "Hide prompts" : "Need inspiration?"}
                <ChevronDown
                  size={14}
                  className={showPrompts ? "rotate-180" : ""}
                />
              </button>
            </div>

            {showPrompts && (
              <div className="mb-4 rounded-xl border border-white/5 bg-black/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <Lightbulb size={14} />
                  A LITTLE INSPIRATION
                </div>

                <p className="mb-1 text-sm font-medium text-gray-200">
                  {prompts[activePrompt].title}
                </p>
                <p className="mb-3 text-sm leading-6 text-gray-400">
                  {prompts[activePrompt].text}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setActivePrompt((current) => (current + 1) % prompts.length)
                    }
                    className="text-xs text-gray-500 transition hover:text-white"
                  >
                    Try another prompt
                  </button>

                  <button
                    type="button"
                    onClick={insertPrompt}
                    className="rounded-lg border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/10"
                  >
                    Add prompt to entry
                  </button>
                </div>
              </div>
            )}

            <textarea
              value={draft.content}
              onChange={(event) =>
                updateDraft("content", event.target.value)
              }
              placeholder="Start wherever you are. You don't need to have it all figured out..."
              rows={15}
              className="min-h-[320px] w-full resize-y rounded-xl border border-white/5 bg-black/10 p-4 text-sm leading-7 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-emerald-500/40 sm:p-5"
            />
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-200">
              <Tag size={15} className="text-emerald-400" />
              Add some tags
              <span className="text-xs font-normal text-gray-500">
                (optional)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-2 text-xs transition ${
                    draft.tags.includes(tag)
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200"
                  }`}
                >
                  {draft.tags.includes(tag) ? "✓ " : "+ "}
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-5">
            <p className="text-xs text-gray-500">
              Your draft is saved in this browser.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
              >
                Keep as draft
              </button>

              <button
                type="button"
                onClick={saveEntry}
                disabled={!draft.title.trim() && !draft.content.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check size={16} />
                {editingId ? "Save changes" : "Save entry"}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Journal dashboard
  return (
    <main className="w-full max-w-none space-y-7 pb-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            YOUR PERSONAL SPACE
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Journal<span className="text-emerald-400">.</span>
          </h1>
          <p className="max-w-xl text-sm leading-6 text-gray-400">
            Your thoughts, your lessons, your journey. Take a moment to check in
            with yourself.
          </p>
        </div>

        <button
          type="button"
          onClick={hasDraft ? continueDraft : startNewEntry}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500 sm:self-auto"
        >
          {hasDraft ? <PenLine size={17} /> : <Plus size={18} />}
          {hasDraft ? "Continue draft" : "Write an entry"}
        </button>
      </header>

      {hasDraft && (
        <button
          type="button"
          onClick={continueDraft}
          className="flex w-full items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-left transition hover:bg-emerald-500/10"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <FileText size={19} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white">
              Unfinished draft
            </p>
            <p className="truncate text-xs text-gray-400">
              {draft.title || getPreview(draft.content) || "Continue where you left off"}
            </p>
          </div>
          <span className="text-xs font-medium text-emerald-400">Continue →</span>
        </button>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-cards p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-cards-500/10 blur-3xl" />

        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-#111827 bg-#111827 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <Sparkles size={14} />
              TODAY'S REFLECTION
            </div>

            <h2 className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
              {prompts[activePrompt].title}
            </h2>
            <p className="max-w-xl text-sm leading-6 text-gray-300">
              {prompts[activePrompt].text}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={startNewEntry}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                <PenLine size={16} />
                Reflect on this
              </button>

              <button
                type="button"
                onClick={() =>
                  setActivePrompt((current) => (current + 1) % prompts.length)
                }
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
              >
                Another prompt
              </button>
            </div>
          </div>

          <div className="hidden h-28 w-28 items-center justify-center rounded-3xl border border-emerald-400/10 bg-emerald-400/5 text-emerald-300 md:flex">
            <BookOpen size={46} strokeWidth={1.2} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-cards p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">Total entries</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <BookOpen size={18} />
            </span>
          </div>
          <p className="text-3xl font-semibold text-white">{entries.length}</p>
          <p className="mt-1 text-xs text-gray-500">Your story, one page at a time</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-cards p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">Writing streak</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Flame size={18} />
            </span>
          </div>
          <p className="text-3xl font-semibold text-white">
            {writingStreak} <span className="text-base font-normal text-gray-400">days</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Entries written on consecutive days</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-cards p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">Words written</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <PenLine size={18} />
            </span>
          </div>
          <p className="text-3xl font-semibold text-white">
            {totalWords.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-gray-500">Every thought adds up</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">Your entries</h2>
            <p className="mt-1 text-sm text-gray-400">
              Revisit what you've felt, learned, and overcome.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your journal..."
              className="w-full rounded-xl border border-white/10 bg-cards py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-500/40"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All entries", "Recent"].map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-lg px-3.5 py-2 text-sm transition ${
                activeFilter === filter
                  ? "bg-emerald-600 text-white"
                  : "border border-white/5 bg-cards text-gray-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}

          <div className="relative">
            <select
              value={selectedMood}
              onChange={(event) => setSelectedMood(event.target.value)}
              className="appearance-none rounded-lg border border-white/10 bg-cards py-2 pl-3 pr-8 text-sm text-gray-300 outline-none focus:border-emerald-500/40"
            >
              <option>All moods</option>
              {moods.map((mood) => (
                <option key={mood.label}>{mood.label}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-cards/50 px-5 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              {searchQuery || selectedMood !== "All moods" ? (
                <Search size={24} />
              ) : (
                <BookOpen size={24} />
              )}
            </div>

            <h3 className="text-base font-semibold text-white">
              {searchQuery || selectedMood !== "All moods"
                ? "No entries found"
                : "Your story starts here"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
              {searchQuery || selectedMood !== "All moods"
                ? "Try another search or change your mood filter."
                : "Make this a space where you can be honest, reflect, and celebrate your progress."}
            </p>

            {!searchQuery && selectedMood === "All moods" && (
              <button
                type="button"
                onClick={startNewEntry}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                <Plus size={16} />
                Write your first entry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredEntries
              .filter((entry) => {
                if (activeFilter === "Recent") {
                  return (
                    Date.now() - new Date(entry.updatedAt || entry.createdAt) <
                    7 * 24 * 60 * 60 * 1000
                  );
                }
                return true;
              })
              .map((entry) => {
                const mood = moods.find((item) => item.label === entry.mood);

                return (
                  <article
                    key={entry.id}
                    className="group rounded-2xl border border-white/5 bg-cards p-5 transition hover:border-emerald-500/20"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <CalendarDays size={13} />
                          {formatDate(entry.updatedAt || entry.createdAt)}
                          {mood && (
                            <>
                              <span>·</span>
                              <span>{mood.emoji} {mood.label}</span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => openEntry(entry)}
                          className="text-left text-base font-semibold text-white transition hover:text-emerald-300"
                        >
                          {entry.title}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteEntry(entry.id)}
                        aria-label={`Delete ${entry.title}`}
                        className="rounded-lg p-2 text-gray-500 opacity-100 transition hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEntry(entry)}
                      className="block w-full text-left"
                    >
                      <p className="line-clamp-3 text-sm leading-6 text-gray-400">
                        {getPreview(entry.content) || "An empty entry."}
                      </p>
                    </button>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span className="shrink-0 text-xs text-gray-500">
                        {countWords(entry.content)} words
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEntry(entry)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
                    >
                      Read entry
                      <span aria-hidden="true">→</span>
                    </button>
                  </article>
                );
              })}
          </div>
        )}
      </section>
    </main>
  );
}

