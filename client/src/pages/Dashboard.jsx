import { DashboardCard, ProgressCircle } from "../components/DashboardCards";
import { dashboardCards } from "../data/dashboardCards";

const Dashboard = () => {
  return (
    <div className="pt-10">
      <div className="flex justify-between gap-5">
        <ProgressCircle days={12} />
        {dashboardCards.map((card) => (
          <DashboardCard {...card} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
