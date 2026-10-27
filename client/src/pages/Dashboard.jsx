import { DashboardCard, ProgressCircle } from "../components/DashboardCards";
import { dashboardCards } from "../data/dashboardCards";
import { nonNegotiableTasks } from "../data/nonNegotiableTasks";

const Dashboard = () => {
  return (
    <div className="pt-10 space-y-10">
      <div className="flex justify-center gap-8">
        <ProgressCircle days={12} />
        {dashboardCards.map((card) => (
          <DashboardCard {...card} />
        ))}
      </div>
      <div className="flex justify-between">
        <div className="bg-cards rounded-xl py-4 px-4 space-y-5">
          <h1 className="font-semibold text-xl">Pending Non-negotiables</h1>
          <div className="border border-success rounded-xl">
            {nonNegotiableTasks.map((task, i) => (
              <p className={`px-4 py-2 ${i > 0 && "border-t border-success"}`}>
                {task}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
