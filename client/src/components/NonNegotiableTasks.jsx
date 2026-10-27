import { useState } from "react";
import { nonNegotiableTasks } from "../data/nonNegotiableTasks";

const NonNegotiableTasks = () => {
  const [checkedTasks, setCheckedTasks] = useState([]);

  const handleCheck = (task) => {
    setCheckedTasks((prev) =>
      prev.includes(task)
        ? prev.filter((item) => item !== task)
        : [...prev, task],
    );
  };

  const handleSave = () => {
    console.log("Selected tasks:", checkedTasks);
    // Save checkedTasks to localStorage or your backend
  };

  return (
    <div className="bg-cards rounded-xl py-5 px-10 w-full space-y-8 relative transition-all duration-300">
      <h1 className="font-semibold text-2xl">Pending Non-negotiables</h1>
      <div className="border border-success rounded-xl overflow-y-auto scrollbar-hide max-h-75">
        {nonNegotiableTasks.map((task, i) => (
          <p
            className={`px-4 py-4 text-sm ${i > 0 && "border-t border-success"} flex items-center gap-3 pr-6`}
            key={i}
          >
            <input
              type="checkbox"
              className="h-5 w-5 accent-relapse cursor-pointer"
              checked={checkedTasks.includes(task)}
              onChange={() => handleCheck(task)}
            />
            {task}
          </p>
        ))}
      </div>
      {checkedTasks.length > 0 && (
        <div className="w-full flex items-center justify-end">
          <button
            className="bg-success rounded-full p-3 text-sm relative cursor-pointer"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default NonNegotiableTasks;
