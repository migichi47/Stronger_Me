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
        className={`px-10 ${showSidebar && "sm:pl-70"} mt-30 transition-all duration-300 space-y-10`}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
