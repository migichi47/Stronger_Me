import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { AppContext } from "../context/ContextProvider";
import { PanelLeft } from "lucide-react";

const Layout = () => {
  const { showSidebar, setShowSidebar } = useContext(AppContext);

  return (
    <>
      <Sidebar />
      <div
        className={`p-10 ${showSidebar && "pl-70"} transition-all duration-300 space-y-10`}
      >
        <div className="flex items-center gap-2">
          {!showSidebar && (
            <button
              onClick={() => {
                setShowSidebar(true);
                localStorage.setItem("sidebar", JSON.stringify("true"));
              }}
              className="rounded-lg p-2 bg-cards text-white hover:bg-gray-800 cursor-pointer hover:text-relapse
              transition-colors duration-300"
            >
              <PanelLeft size={15} />
            </button>
          )}
          <h1 className="font-semibold text-2xl">Welcome back, Naneu Junior</h1>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
