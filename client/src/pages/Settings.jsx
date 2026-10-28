import { useEffect, useState } from "react";
import {
  UserRound,
  Palette,
  Bell,
  Target,
  Database,
  SlidersHorizontal,
  CircleHelp,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Download,
  LogOut,
  ShieldCheck,
  Save,
  Menu,
  X,
} from "lucide-react";

const STORAGE_KEY = "habit-tracker-settings";

const sections = [
  { id: "profile", label: "Profile & Account", icon: UserRound },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "productivity", label: "Productivity", icon: Target },
  { id: "preferences", label: "App Preferences", icon: SlidersHorizontal },
  { id: "data", label: "Data & Privacy", icon: Database },
  { id: "support", label: "About & Support", icon: CircleHelp },
];

const defaultSettings = {
  name: "",
  email: "",
  theme: "light",
  defaultCalendarView: "week",
  dailyReminder: true,
  taskReminders: true,
  morningPlanning: false,
  eveningReview: true,
  weekStarts: "monday",
  dayStart: "06:00",
  dayEnd: "22:00",
  weeklyTarget: "80",
  defaultDuration: "60",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12",
  landingPage: "dashboard",
};

function readSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(readSettings);
  const [activeSection, setActiveSection] = useState("appearance");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark",
    );
  }, [settings.theme]);

  function updateSetting(name, value) {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
    setSavedMessage("");
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedMessage("Your preferences have been saved.");
    } catch {
      setSavedMessage("Could not save settings. Check your browser storage.");
    }
  }

  function exportData() {
    const data = {
      settings,
      calendarTasks: readJSON("my-calendar-tasks"),
      exportedAt: new Date().toISOString(),
    };

    const file = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "habit-tracker-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function readJSON(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  }

  function handleSectionChange(id) {
    setActiveSection(id);
    setMobileMenuOpen(false);
  }

  const activeLabel =
    sections.find((section) => section.id === activeSection)?.label ||
    "Settings";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Page heading */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Personalize your experience and manage your preferences.
            </p>
          </div>

          <button
            onClick={saveSettings}
            className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex"
          >
            <Save size={17} />
            Save changes
          </button>
        </header>

        {/* Mobile section selector */}
        <div className="mb-5 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <span className="flex items-center gap-3 font-semibold">
              {(() => {
                const Icon = sections.find((s) => s.id === activeSection)?.icon;
                return Icon ? <Icon size={20} /> : null;
              })()}
              {activeLabel}
            </span>
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm ${
                      activeSection === section.id
                        ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={18} />
                    {section.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Desktop sidebar */}
          <aside className="sticky top-6 hidden rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 lg:block">
            <p className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Preferences
            </p>

            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                      active
                        ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={19} />
                    <span className="flex-1">{section.label}</span>
                    {active && <ChevronRight size={16} />}
                  </button>
                );
              })}
            </nav>

            <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <ShieldCheck size={22} className="text-emerald-600" />
              <p className="mt-3 text-sm font-semibold">
                Your productivity matters
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                Customize your workspace to support your daily routines.
              </p>
            </div>
          </aside>

          {/* Main settings content */}
          <main className="min-w-0 space-y-5">
            {activeSection === "profile" && (
              <SectionCard
                title="Profile & Account"
                description="Manage your personal details."
              >
                <SettingField
                  label="Full name"
                  description="How your name appears in the app."
                >
                  <input
                    value={settings.name}
                    onChange={(e) => updateSetting("name", e.target.value)}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </SettingField>

                <SettingField
                  label="Email address"
                  description="Your account email."
                >
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </SettingField>

                <SettingField
                  label="Password"
                  description="Password changes should be handled securely by your authentication backend."
                >
                  <button
                    onClick={() =>
                      alert("Connect this button to your password reset flow.")
                    }
                    className={secondaryButton}
                  >
                    Change password
                  </button>
                </SettingField>

                <SettingField
                  label="Sign out"
                  description="Sign out of your account on this device."
                >
                  <button
                    onClick={() =>
                      alert(
                        "Connect this action to your authentication system.",
                      )
                    }
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </SettingField>
              </SectionCard>
            )}

            {activeSection === "appearance" && (
              <>
                <SectionCard
                  title="Appearance"
                  description="Make your workspace feel like yours."
                >
                  <SettingField
                    label="Theme"
                    description="Choose how the app looks."
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "light", label: "Light", Icon: Sun },
                        { value: "dark", label: "Dark", Icon: Moon },
                        {
                          value: "system",
                          label: "System",
                          Icon: Monitor,
                        },
                      ].map(({ value, label, Icon }) => (
                        <button
                          key={value}
                          onClick={() => updateSetting("theme", value)}
                          className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-sm transition ${
                            settings.theme === value
                              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Icon size={20} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </SettingField>
                </SectionCard>

                <SectionCard
                  title="Calendar appearance"
                  description="Choose how your calendar opens."
                >
                  <SettingField
                    label="Default calendar view"
                    description="The view shown when you open My Calendar."
                  >
                    <Select
                      value={settings.defaultCalendarView}
                      onChange={(value) =>
                        updateSetting("defaultCalendarView", value)
                      }
                      options={[
                        { value: "week", label: "Week" },
                        { value: "month", label: "Month" },
                        { value: "agenda", label: "Agenda" },
                      ]}
                    />
                  </SettingField>
                </SectionCard>
              </>
            )}

            {activeSection === "reminders" && (
              <SectionCard
                title="Notifications & Reminders"
                description="Choose which reminders you want to enable."
              >
                <SettingField
                  label="Daily habit reminders"
                  description="Remind me to complete my daily habits."
                >
                  <Toggle
                    checked={settings.dailyReminder}
                    onChange={(value) => updateSetting("dailyReminder", value)}
                  />
                </SettingField>

                <SettingField
                  label="Task reminders"
                  description="Remind me about scheduled tasks and deadlines."
                >
                  <Toggle
                    checked={settings.taskReminders}
                    onChange={(value) => updateSetting("taskReminders", value)}
                  />
                </SettingField>

                <SettingField
                  label="Morning planning"
                  description="Create time for planning my day."
                >
                  <Toggle
                    checked={settings.morningPlanning}
                    onChange={(value) =>
                      updateSetting("morningPlanning", value)
                    }
                  />
                </SettingField>

                <SettingField
                  label="Evening review"
                  description="Review my progress before going to bed."
                >
                  <Toggle
                    checked={settings.eveningReview}
                    onChange={(value) => updateSetting("eveningReview", value)}
                  />
                </SettingField>

                <p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  These options save your preferences, but do not send
                  notifications yet. Actual reminders require a notification or
                  scheduling implementation.
                </p>
              </SectionCard>
            )}

            {activeSection === "productivity" && (
              <SectionCard
                title="Productivity"
                description="Set up your preferred working routine."
              >
                <SettingField
                  label="Daily start time"
                  description="When your planned day begins."
                >
                  <input
                    type="time"
                    value={settings.dayStart}
                    onChange={(e) => updateSetting("dayStart", e.target.value)}
                    className={inputClass}
                  />
                </SettingField>

                <SettingField
                  label="Daily end time"
                  description="When your planned day ends."
                >
                  <input
                    type="time"
                    value={settings.dayEnd}
                    onChange={(e) => updateSetting("dayEnd", e.target.value)}
                    className={inputClass}
                  />
                </SettingField>

                <SettingField
                  label="Weekly completion target"
                  description="Your desired percentage of planned tasks completed."
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={settings.weeklyTarget}
                      onChange={(e) =>
                        updateSetting("weeklyTarget", e.target.value)
                      }
                      className="w-full accent-blue-600"
                    />
                    <span className="w-12 text-right font-semibold">
                      {settings.weeklyTarget}%
                    </span>
                  </div>
                </SettingField>

                <SettingField
                  label="Default task duration"
                  description="The initial duration used when creating a task."
                >
                  <Select
                    value={settings.defaultDuration}
                    onChange={(value) =>
                      updateSetting("defaultDuration", value)
                    }
                    options={[
                      { value: "15", label: "15 minutes" },
                      { value: "30", label: "30 minutes" },
                      { value: "45", label: "45 minutes" },
                      { value: "60", label: "1 hour" },
                      { value: "90", label: "1.5 hours" },
                      { value: "120", label: "2 hours" },
                    ]}
                  />
                </SettingField>

                <SettingField
                  label="Week starts on"
                  description="Choose the first day of your weekly schedule."
                >
                  <Select
                    value={settings.weekStarts}
                    onChange={(value) => updateSetting("weekStarts", value)}
                    options={[
                      { value: "monday", label: "Monday" },
                      { value: "sunday", label: "Sunday" },
                    ]}
                  />
                </SettingField>
              </SectionCard>
            )}

            {activeSection === "preferences" && (
              <SectionCard
                title="App Preferences"
                description="Control how dates and times are displayed."
              >
                <SettingField
                  label="Date format"
                  description="Choose your preferred date format."
                >
                  <Select
                    value={settings.dateFormat}
                    onChange={(value) => updateSetting("dateFormat", value)}
                    options={[
                      { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                      { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                      { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                    ]}
                  />
                </SettingField>

                <SettingField
                  label="Time format"
                  description="Choose between 12-hour and 24-hour time."
                >
                  <Select
                    value={settings.timeFormat}
                    onChange={(value) => updateSetting("timeFormat", value)}
                    options={[
                      { value: "12", label: "12-hour (9:30 AM)" },
                      { value: "24", label: "24-hour (09:30)" },
                    ]}
                  />
                </SettingField>

                <SettingField
                  label="Default landing page"
                  description="The page you'd like to see after opening the app."
                >
                  <Select
                    value={settings.landingPage}
                    onChange={(value) => updateSetting("landingPage", value)}
                    options={[
                      { value: "dashboard", label: "Dashboard" },
                      { value: "calendar", label: "My Calendar" },
                      { value: "habits", label: "My Habits" },
                      { value: "goals", label: "My Goals" },
                    ]}
                  />
                </SettingField>

                <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                  These are saved preferences. To apply the date format, time
                  format, or landing page across the app, read these settings in
                  your calendar, task components, and routing logic.
                </div>
              </SectionCard>
            )}

            {activeSection === "data" && (
              <SectionCard
                title="Data & Privacy"
                description="Keep control of your productivity data."
              >
                <SettingField
                  label="Export your data"
                  description="Download your settings and locally stored calendar tasks as JSON."
                >
                  <button onClick={exportData} className={secondaryButton}>
                    <Download size={17} />
                    Export data
                  </button>
                </SettingField>

                <SettingField
                  label="Clear local data"
                  description="Remove locally stored calendar tasks and preferences from this browser."
                >
                  <button
                    onClick={() => {
                      const confirmed = window.confirm(
                        "This will delete your saved calendar tasks and settings from this browser. Continue?",
                      );

                      if (!confirmed) return;

                      localStorage.removeItem("my-calendar-tasks");
                      localStorage.removeItem(STORAGE_KEY);
                      window.location.reload();
                    }}
                    className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Clear local data
                  </button>
                </SettingField>

                <p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  Clearing local data cannot delete information saved on a
                  server. Connect this section to your backend before offering
                  account-wide data deletion.
                </p>
              </SectionCard>
            )}

            {activeSection === "support" && (
              <SectionCard
                title="About & Support"
                description="Information about your habit tracker."
              >
                <SettingField
                  label="Application"
                  description="Your productivity workspace."
                >
                  <span className="text-sm font-semibold">Habit Tracker</span>
                </SettingField>

                <SettingField
                  label="Version"
                  description="Current application version."
                >
                  <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800">
                    Version 1.0.0
                  </span>
                </SettingField>

                <SettingField
                  label="Feedback"
                  description="Give feedback or report an issue."
                >
                  <a
                    href="mailto:support@example.com?subject=Habit%20Tracker%20Feedback"
                    className={secondaryButton}
                  >
                    <CircleHelp size={17} />
                    Contact support
                  </a>
                </SettingField>

                <p className="text-xs leading-5 text-gray-400">
                  Replace the example support email with your actual support
                  address before deployment.
                </p>
              </SectionCard>
            )}

            {/* Save button */}
            <div className="sticky bottom-3 z-10 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p
                  role="status"
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {savedMessage || "Remember to save your changes."}
                </p>

                <button
                  onClick={saveSettings}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Save size={17} />
                  Save changes
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-950";

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800";

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="mb-5 border-b border-gray-100 pb-5 dark:border-gray-800">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {children}
      </div>
    </section>
  );
}

function SettingField({ label, description, children }) {
  return (
    <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="sm:max-w-[55%]">
        <h3 className="text-sm font-semibold">{label}</h3>
        {description && (
          <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      <div className="w-full sm:w-64 sm:shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative flex h-6 w-11 items-center rounded-full transition ${
        checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
