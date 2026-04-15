import { useState } from "react";

const defaultTasks = [
  { text: "Upload Resume", done: true },
  { text: "Analyze JD", done: false },
  { text: "Improve Skills", done: false },
];

export default function TaskList({ items = defaultTasks }) {
  const [tasks, setTasks] = useState(items);

  const toggle = (i) => {
    const updated = [...tasks];
    updated[i].done = !updated[i].done;
    setTasks(updated);
  };

  const syncedTasks = tasks.length === items.length ? tasks : items;

  return (
    <div className="space-y-3">
      {syncedTasks.map((t, i) => (
        <label
          key={i}
          className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-slate-200"
        >
          <span className="font-medium">{t.text}</span>
          <input
            type="checkbox"
            checked={t.done}
            onChange={() => toggle(i)}
            className="h-4 w-4 accent-emerald-400"
          />
        </label>
      ))}
    </div>
  );
}
