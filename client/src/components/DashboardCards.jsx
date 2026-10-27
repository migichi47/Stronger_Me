import { FaFireFlameCurved } from "react-icons/fa6";

const cardStyles = `bg-cards w-fit px-20 py-6 rounded-xl flex flex-col items-center gap-4 p-5 cursor-pointer
  hover:shadow-xs hover:shadow-success/50 transition-all`;

export const DashboardCard = ({ title, icon, value }) => {
  const Icon = icon;

  return (
    <div className={cardStyles}>
      <h1 className="font-semibold text-xl">{title}</h1>
      <div className="flex gap-5 items-center">
        <span className="border-3 border-success rounded-full p-8">
          <Icon className="text-3xl" />
        </span>
        <span className="text-white text-4xl font-bold">{value}</span>
      </div>
    </div>
  );
};

export const ProgressCircle = ({ days = 12 }) => {
  const progress = (days / 30) * 100;

  return (
    <div className={cardStyles}>
      <h1 className="font-semibold text-xl">Current Streak</h1>
      <div className="flex gap-5 items-center">
        <div
          className="w-26 h-26 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(
          #10B981 ${progress}%,
          #374151 ${progress}% 100%
        )`,
          }}
        >
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center">
            <FaFireFlameCurved className="text-5xl text-success" />
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-white text-4xl font-bold">{days}</span>
          <span className="text-sm">Days</span>
        </div>
      </div>
    </div>
  );
};
