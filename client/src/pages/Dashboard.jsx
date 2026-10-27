import { DashboardCard, ProgressCircle } from "../components/DashboardCards";
import { dashboardCards } from "../data/dashboardCards";
import NonNegotiableTasks from "../components/NonNegotiableTasks";

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
        <NonNegotiableTasks />
      </div>
    </div>
  );
};

export default Dashboard;
