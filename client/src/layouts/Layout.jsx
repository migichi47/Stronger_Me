import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { AppContext } from "../context/ContextProvider";
import Header from "../components/Header";

const Layout = () => {
  const { showSidebar } = useContext(AppContext);

  return (
    <>
      <Sidebar />
      <Header />
      <div
<<<<<<< HEAD
        className={`p-10 ${showSidebar && "pl-70"} transition-all duration-300 `}
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
          <h1 className="font-semibold text-2xl">Welcome back, Naneu J</h1>
        </div>
=======
        className={`px-10 ${showSidebar && "pl-70"} mt-30 transition-all duration-300 space-y-10`}
      >
>>>>>>> 53186773ae1682f1be0b894dd1f13f21cc9a247c
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
