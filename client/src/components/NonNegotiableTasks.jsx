import { nonNegotiableTasks } from "../data/nonNegotiableTasks";

const NonNegotiableTasks = () => {
  return (
    <div className="bg-cards rounded-xl py-5 px-10 space-y-5 w-fit min-w-[40vw]">
      <h1 className="font-semibold text-2xl">Pending Non-negotiables</h1>
      <div className="border border-success rounded-xl overflow-y-auto scrollbar-hide max-h-75">
        {nonNegotiableTasks.map((task, i) => (
          <p
            className={`px-4 py-2 text-lg ${i > 0 && "border-t border-success"} flex items-center justify-between pr-6`}
          >
            {task}
            <input
              type="checkbox"
              className="h-5 w-5 accent-relapse cursor-pointer"
            />
          </p>
        ))}
      </div>
    </div>
  );
};

export default NonNegotiableTasks;
