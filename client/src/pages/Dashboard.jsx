import { PanelLeft } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/ContextProvider";

const Dashboard = () => {
  const { showSidebar, setShowSidebar } = useContext(AppContext);
  console.log(showSidebar);

  return (
    <div>
      <div className="flex items-center gap-2">
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="rounded-lg p-2 bg-cards text-white hover:bg-gray-800"
          >
            <PanelLeft size={15} />
          </button>
        )}
        <h1 className="font-semibold text-2xl">Welcome back, Naneu</h1>
      </div>
    </div>
  );
};

export default Dashboard;
