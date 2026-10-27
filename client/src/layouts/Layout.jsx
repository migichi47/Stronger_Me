import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { AppContext } from "../context/ContextProvider";

const Layout = () => {
  const { showSidebar } = useContext(AppContext);

  return (
    <>
      <Sidebar />
      <div
        className={`p-5 ${showSidebar && "pl-70"} transition-all duration-300`}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
