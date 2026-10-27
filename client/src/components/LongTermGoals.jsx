import { useState } from "react";
import { CgUnavailable } from "react-icons/cg";
import { longTermGoals } from "../data/longTermGoals";

const LongTermGoals = () => {
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
      <h1 className="font-semibold text-2xl">Pending Long Term Goals</h1>
      {!longTermGoals || longTermGoals.length === 0 ? (
        <div className="flex flex-col items-center gap-5 text-gray-400 mt-20">
          <CgUnavailable className="text-8xl" />
          <span className="text-xl">Oops! no long term goals</span>
        </div>
      ) : (
        <div className="border border-success rounded-xl overflow-y-auto scrollbar-hide max-h-75">
          {longTermGoals.map((task, i) => (
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
      )}
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

export default LongTermGoals;
