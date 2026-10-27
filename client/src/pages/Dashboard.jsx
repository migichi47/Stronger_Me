import { DashboardCard, ProgressCircle } from "../components/DashboardCards";
import { dashboardCards } from "../data/dashboardCards";
import NonNegotiableTasks from "../components/NonNegotiableTasks";
import DashboardCalendar from "../components/Calendar";
import { dailyRecords } from "../data/dailyRecords";
import LongTermGoals from "../components/LongTermGoals";

const Dashboard = () => {
  return (
    <div className="space-y-10">
      <div className="flex justify-center gap-8">
        <ProgressCircle days={12} />
        {dashboardCards.map((card, i) => (
          <DashboardCard key={i} {...card} />
        ))}
      </div>
      <div className="flex justify-between gap-5">
        <NonNegotiableTasks />
        <LongTermGoals />
        <DashboardCalendar dailyRecords={dailyRecords} />
      </div>
    </div>
  );
};

export default Dashboard;
