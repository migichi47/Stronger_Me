import { useContext } from "react";
import { PanelLeft } from "lucide-react";
import { AppContext } from "../context/ContextProvider";

const Header = () => {
  const { showSidebar, setShowSidebar } = useContext(AppContext);

  return (
    <div
      className={`flex items-center gap-2 fixed top-0 bg-background/50 backdrop-blur-2xl transition-all
    w-full shadow-xs shadow-white/20 py-5 px-10 ${showSidebar ? "left-60" : "left-0"} duration-300`}
    >
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
  );
};

export default Header;
