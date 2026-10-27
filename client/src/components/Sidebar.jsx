import { useContext } from "react";
import { CircleUser, LogOut, X } from "lucide-react";
import { AppContext } from "../context/ContextProvider";
import { navLinks } from "../data/navLinks.js";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { showSidebar, setShowSidebar } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <>
      <aside
        className={`bg-cards fixed left-0 top-0 z-50
          h-screen w-64 py-5 space-y-4
          transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <img
          src="https://res.cloudinary.com/pzmxzqp0/image/upload/v1793056049/WhatsApp_Image_2026-10-27_at_1.59.04_AM-remover-bg.png"
          alt="Logo"
          className="h-16 w-30 cursor-pointer object-cover"
          onClick={() => navigate("/")}
        />

        <button
          onClick={() => {
            setShowSidebar(false);
            localStorage.setItem("sidebar", JSON.stringify("false"));
          }}
          className="absolute right-5 top-10"
          aria-label="Close sidebar"
        >
          <X className="cursor-pointer hover:text-relapse transition duration-300" />
        </button>
        <nav className="flex flex-col">
          {navLinks.map((navLink, i) => {
            const Icon = navLink.icon;
            return (
              <NavLink
                key={i}
                to={navLink.linkTo}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-6 py-4 transition-all duration-75 ${
                    isActive
                      ? "bg-relapse/70 text-white"
                      : "text-gray-300 hover:bg-relapse/20"
                  }`
                }
              >
                <Icon />
                <span className="capitalize">{navLink.name}</span>
              </NavLink>
            );
          })}
        </nav>
        <div
          className="absolute bottom-20 left-0 flex w-full flex-col gap-6 px-6
          border-t-2 pt-15 border-relapse"
        >
          <button className="flex items-center gap-2 hover:text-red-400">
            <LogOut />
            <span>Logout</span>
          </button>

          <button className="flex items-center gap-2 hover:text-gray-400">
            <CircleUser />
            <span>Profile</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
