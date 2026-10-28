import STORAGE_KEY from "../data/STORAGE_KEY";

export function getStoredTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}


