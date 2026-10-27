import { useContext } from "react";
import { CircleUser, LogOut, X } from "lucide-react";
import { AppContext } from "../context/ContextProvider";
import { navLinks } from "../data/navLinks.js";

const Sidebar = () => {
  const { showSidebar, setShowSidebar } = useContext(AppContext);

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
        />

        <button
          onClick={() => setShowSidebar(false)}
          className="absolute right-5 top-10"
          aria-label="Close sidebar"
        >
          <X
            className="cursor-pointer hover:text-relapse transition duration-300"
            onClick={() => setShowSidebar(false)}
          />
        </button>
        <nav className="flex flex-col">
          {navLinks.map((navLink, i) => {
            const Icon = navLink.icon;
            return (
              <a
                key={i}
                href={navLink.linkTo}
                className="flex items-center gap-2 px-6 py-4 hover:bg-gray-800"
                onClick={() => setShowSidebar(false)}
              >
                <Icon />
                <span className="capitalize">{navLink.name}</span>
              </a>
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
